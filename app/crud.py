from sqlalchemy.orm import Session, joinedload
from . import models, schemas

def create_party(db: Session, user: schemas.UserCreate):
    db_login = models.UserLogin(
        ULN_Email=user.email,
        ULN_Password=user.password, 
    )
    db.add(db_login)
    db.commit()
    db.refresh(db_login)

    db_party = models.Party(
        PTY_Name=user.name,
        PTY_Type=user.user_type,
        PTY_Phone=user.phone,
        PTY_AddressLine1=user.address1,
        PTY_AddressLine2=user.address2,
        PTY_City=user.city,
        PTY_State=user.state,
        PTY_Zip=user.zip,
        ULN_ID=db_login.ULN_ID
    )
    db.add(db_party)
    db.commit()
    db.refresh(db_party)
    return db_party

def create_request(db: Session, request: schemas.RequestCreate):
    db_request = models.ItemsRequest(
        PTY_ID=request.user_id,
        ITR_ItemName=request.item_name,
        ITR_Quantity=request.quantity,
        ITR_PendingQuantity=request.quantity 
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def get_party_requests(db: Session, party_id: int):
    requests = db.query(models.ItemsRequest).filter(models.ItemsRequest.PTY_ID == party_id).all()
    results = []
    for req in requests:
        data = schemas.RequestResponse.model_validate(req)
        filled = db.query(models.FilledDonations).filter(models.FilledDonations.ITR_ID == req.ITR_ID).first()
        if filled:
            don = db.query(models.ItemDonations).filter(models.ItemDonations.ITD_ID == filled.ITD_ID).first()
            if don and don.donor:
                data.match_name = don.donor.PTY_Name
        results.append(data)
    return results

def create_donation(db: Session, donation: schemas.DonationCreate):
    db_donation = models.ItemDonations(
        PTY_ID=donation.user_id,
        ITD_ItemName=donation.item_name,
        ITD_Quantity=donation.quantity,
        ITD_PendingQuantity=donation.quantity 
    )
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)
    return db_donation

def get_party_donations(db: Session, party_id: int):
    donations = db.query(models.ItemDonations).filter(models.ItemDonations.PTY_ID == party_id).all()
    results = []
    for don in donations:
        data = schemas.DonationResponse.model_validate(don)
        filled = db.query(models.FilledDonations).filter(models.FilledDonations.ITD_ID == don.ITD_ID).first()
        if filled:
            req = db.query(models.ItemsRequest).filter(models.ItemsRequest.ITR_ID == filled.ITR_ID).first()
            if req and req.requester:
                data.match_name = req.requester.PTY_Name
        results.append(data)
    return results

def find_matches_for_request(db: Session, item_type: str):
    return db.query(models.ItemDonations).options(joinedload(models.ItemDonations.donor)).filter(
        models.ItemDonations.ITD_ItemName == item_type,
        models.ItemDonations.ITD_PendingQuantity > 0
    ).all()

def find_matches_for_donation(db: Session, item_type: str):
    return db.query(models.ItemsRequest).options(joinedload(models.ItemsRequest.requester)).filter(
        models.ItemsRequest.ITR_ItemName == item_type,
        models.ItemsRequest.ITR_PendingQuantity > 0
    ).all()

def process_transaction(db: Session, transaction: schemas.TransactionCreate):
    req = db.query(models.ItemsRequest).filter(models.ItemsRequest.ITR_ID == transaction.request_id).first()
    don = db.query(models.ItemDonations).filter(models.ItemDonations.ITD_ID == transaction.donation_id).first()
    req.ITR_PendingQuantity -= transaction.quantity
    don.ITD_PendingQuantity -= transaction.quantity
    filled = models.FilledDonations(
        ITR_ID=req.ITR_ID,
        ITD_ID=don.ITD_ID,
        FID_Quantity=transaction.quantity
    )
    db.add(filled)
    db.commit()
    return {"message": "Transaction Successful"}