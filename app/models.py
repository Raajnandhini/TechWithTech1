from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class UserLogin(Base):
    __tablename__ = "OPT_UserLogin"

    ULN_ID = Column(Integer, primary_key=True, index=True)
    ULN_Email = Column(String, unique=True, index=True)
    ULN_Password = Column(String)  
    ULN_CreateDate = Column(DateTime, default=datetime.utcnow)
    
    ULN_ResetOTP = Column(String, nullable=True)     
    ULN_OTPExpiry = Column(DateTime, nullable=True)  

    party = relationship("Party", back_populates="login", uselist=False)

class Party(Base):
    __tablename__ = "OPT_Party"

    PTY_ID = Column(Integer, primary_key=True, index=True)
    ULN_ID = Column(Integer, ForeignKey("OPT_UserLogin.ULN_ID")) 
    
    PTY_Name = Column(String)      
    PTY_Type = Column(String)      
    PTY_Phone = Column(String)
    
    PTY_AddressLine1 = Column(String, nullable=True)
    PTY_AddressLine2 = Column(String, nullable=True)
    PTY_City = Column(String, nullable=True)
    PTY_State = Column(String, nullable=True)
    PTY_Zip = Column(String, nullable=True)

    login = relationship("UserLogin", back_populates="party")
    donations = relationship("ItemDonations", back_populates="donor")
    requests = relationship("ItemsRequest", back_populates="requester")

class ItemDonations(Base):
    __tablename__ = "OPT_ItemDonations"

    ITD_ID = Column(Integer, primary_key=True, index=True)
    PTY_ID = Column(Integer, ForeignKey("OPT_Party.PTY_ID")) 
    
    ITD_ItemName = Column(String)    
    ITD_Quantity = Column(Integer)   
    ITD_PendingQuantity = Column(Integer) 
    ITD_CreateDate = Column(DateTime, default=datetime.utcnow)

    donor = relationship("Party", back_populates="donations")

class ItemsRequest(Base):
    __tablename__ = "OPT_ItemsRequest"

    ITR_ID = Column(Integer, primary_key=True, index=True)
    PTY_ID = Column(Integer, ForeignKey("OPT_Party.PTY_ID")) 
    
    ITR_ItemName = Column(String)    
    ITR_Quantity = Column(Integer)   
    ITR_PendingQuantity = Column(Integer) 
    ITR_CreateDate = Column(DateTime, default=datetime.utcnow)

    requester = relationship("Party", back_populates="requests")

class FilledDonations(Base):
    __tablename__ = "OPT_FilledDonations"

    FID_ID = Column(Integer, primary_key=True, index=True)
    
    ITR_ID = Column(Integer, ForeignKey("OPT_ItemsRequest.ITR_ID")) 
    ITD_ID = Column(Integer, ForeignKey("OPT_ItemDonations.ITD_ID")) 
    
    FID_Quantity = Column(Integer) 
    FID_Date = Column(DateTime, default=datetime.utcnow)