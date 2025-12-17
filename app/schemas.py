from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    user_type: str  
    name: str       
    phone: str
    
    address1: Optional[str] = None
    address2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyResetOTP(BaseModel):
    email: EmailStr
    otp: str          
    new_password: str 

class PartyResponse(BaseModel):
    PTY_ID: int
    PTY_Name: str
    PTY_Type: str
    model_config = ConfigDict(from_attributes=True)

class RequestCreate(BaseModel):
    user_id: int
    item_name: str
    quantity: int

class RequestResponse(BaseModel):
    ITR_ID: int
    ITR_ItemName: str
    ITR_Quantity: int
    ITR_PendingQuantity: int
    ITR_CreateDate: datetime
    match_name: Optional[str] = None 
    model_config = ConfigDict(from_attributes=True)

class DonationCreate(BaseModel):
    user_id: int
    item_name: str
    quantity: int

class DonationResponse(BaseModel):
    ITD_ID: int
    ITD_ItemName: str
    ITD_Quantity: int
    ITD_PendingQuantity: int
    ITD_CreateDate: datetime
    match_name: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class TransactionCreate(BaseModel):
    request_id: int
    donation_id: int
    quantity: int