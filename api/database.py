import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Arahkan koneksi langsung ke file db.sqlite3 milik Django
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../app/db.sqlite3"))
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Connect to engine via sqlalchemy
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
# ORM fuctional for session maker input data
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Run a function to ORM fuctional (batch input) and close after ended
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()