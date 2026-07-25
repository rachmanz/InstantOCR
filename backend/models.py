from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from backend.database import Base

# ORM Structured Skeleton for table
class OCRDocument(Base):
    __tablename__ = "project_ocrdocument"  # Nama tabel Django (biasanya: appname_modelname)

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    extracted_text = Column(Text, nullable=True)
    export_format = Column(String(10), default="txt")
    created_at = Column(DateTime, default=datetime.utcnow)