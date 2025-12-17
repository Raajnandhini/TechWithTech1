from app.database import engine
from app.models import Base

# This connects to the database and forces it to synchronize with your code
def reset():
    print("1. Connecting to Database...")
    
    print("2. Deleting OLD tables (with wrong column names)...")
    try:
        Base.metadata.drop_all(bind=engine)
        print("   - Tables Deleted.")
    except Exception as e:
        print(f"   - Warning during delete: {e}")

    print("3. Creating NEW tables (with ULN_Email)...")
    Base.metadata.create_all(bind=engine)
    print("   - Tables Created!")
    
    print("\n✅ SUCCESS: Database is now in sync with your code.")

if __name__ == "__main__":
    reset()