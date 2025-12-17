from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import random
import string
from datetime import datetime, timedelta

from pydantic import EmailStr, BaseModel
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

from . import models, schemas, crud
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

conf = ConnectionConfig(
    MAIL_USERNAME = "b22cs078@kitsw.ac.in",
    MAIL_PASSWORD = "romgzmwvqfhfqyll",
    MAIL_FROM = "b22cs078@kitsw.ac.in",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

async def send_email_async(subject: str, email_to: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    
    print(f"✅ Email sent successfully to {email_to}")

@app.post("/signup", response_model=schemas.PartyResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_party(db=db, user=user)

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email")
    
    if db_user.ULN_Password != user.password:
        raise HTTPException(status_code=400, detail="Invalid password")
    
    party = db_user.party
    if not party:
        party = db.query(models.Party).filter(models.Party.ULN_ID == db_user.ULN_ID).first()
        if not party:
             raise HTTPException(status_code=500, detail="User profile corrupted (No Party ID)")

    return {
        "message": "Login Successful",
        "user_id": db_user.ULN_ID,
        "party_id": party.PTY_ID,
        "name": party.PTY_Name,
        "type": party.PTY_Type
    }

@app.post("/forgot-password/temp")
async def forgot_password_temp(
    request: schemas.ForgotPasswordRequest, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    user = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    temp_pass = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

    user.ULN_Password = temp_pass
    db.commit()

    email_body = f"Hello, your temporary password is: <b>{temp_pass}</b>. Please login and change it."
    background_tasks.add_task(send_email_async, "Your Temporary Password", request.email, email_body)

    return {"message": "Temporary password generated and sent to email."}

@app.post("/forgot-password/otp")
async def forgot_password_otp(
    request: schemas.ForgotPasswordRequest, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    user = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp_code = ''.join(random.choices(string.digits, k=8))

    user.ULN_ResetOTP = otp_code
    user.ULN_OTPExpiry = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    email_body = f"Hello, your reset code is: <b>{otp_code}</b>. It expires in 15 minutes."
    background_tasks.add_task(send_email_async, "Your Password Reset Code", request.email, email_body)

    return {"message": "OTP sent to email."}

@app.post("/reset-password/verify")
def verify_reset_otp(data: schemas.VerifyResetOTP, db: Session = Depends(get_db)):
    user = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    if user.ULN_ResetOTP != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if user.ULN_OTPExpiry and datetime.utcnow() > user.ULN_OTPExpiry:
        raise HTTPException(status_code=400, detail="OTP has expired")

    user.ULN_Password = data.new_password
    user.ULN_ResetOTP = None
    user.ULN_OTPExpiry = None
    db.commit()

    return {"message": "Password reset successful. You can now login."}

@app.post("/requests/create", response_model=schemas.RequestResponse)
def create_request(request: schemas.RequestCreate, db: Session = Depends(get_db)):
    return crud.create_request(db=db, request=request)

@app.get("/requests/{party_id}", response_model=List[schemas.RequestResponse])
def read_requests(party_id: int, db: Session = Depends(get_db)):
    return crud.get_party_requests(db, party_id=party_id)

@app.post("/donations/create", response_model=schemas.DonationResponse)
def create_donation(donation: schemas.DonationCreate, db: Session = Depends(get_db)):
    return crud.create_donation(db=db, donation=donation)

@app.get("/donations/{party_id}", response_model=List[schemas.DonationResponse])
def read_donations(party_id: int, db: Session = Depends(get_db)):
    return crud.get_party_donations(db, party_id=party_id)

@app.get("/donations/available", response_model=List[schemas.DonationResponse])
def get_all_available_donations(db: Session = Depends(get_db)):
    return db.query(models.ItemDonations).filter(models.ItemDonations.ITD_PendingQuantity > 0).all()

@app.get("/matches/donations/{item_type}")
def find_matching_donations(item_type: str, db: Session = Depends(get_db)):
    return crud.find_matches_for_request(db, item_type)

@app.get("/matches/requests/{item_type}")
def find_matching_requests(item_type: str, db: Session = Depends(get_db)):
    return crud.find_matches_for_donation(db, item_type)

@app.post("/transact/match")
def execute_match(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return crud.process_transaction(db, transaction)