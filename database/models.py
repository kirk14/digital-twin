import uuid
from sqlalchemy import Column, String, Date, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String)
    contact_info = Column(JSONB, server_default='{}')
    consent_flags = Column(JSONB, server_default='{}')
    is_active = Column(Boolean, server_default='true', nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    ehr_records = relationship("EHRRecord", back_populates="patient", cascade="all, delete")
    biomarkers = relationship("Biomarker", back_populates="patient", cascade="all, delete")
    simulations = relationship("Simulation", back_populates="patient", cascade="all, delete")
    patient_medications = relationship("PatientMedication", back_populates="patient", cascade="all, delete")
    genomic_data = relationship("GenomicData", back_populates="patient", uselist=False, cascade="all, delete")


class Provider(Base):
    __tablename__ = "providers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    specialization = Column(String)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    is_active = Column(Boolean, server_default='true', nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    ehr_records = relationship("EHRRecord", back_populates="provider")


class EHRRecord(Base):
    __tablename__ = "ehr_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("providers.id", ondelete="RESTRICT"), nullable=False)
    diagnosis_codes = Column(ARRAY(Text), server_default='{}')
    clinical_notes = Column(Text)
    visit_date = Column(TIMESTAMP(timezone=True), nullable=False)
    attachments = Column(JSONB, server_default='{}')

    patient = relationship("Patient", back_populates="ehr_records")
    provider = relationship("Provider", back_populates="ehr_records")


class Medication(Base):
    __tablename__ = "medications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    drug_class = Column(String)
    standard_dosage = Column(String)
    interaction_flags = Column(JSONB, server_default='{}')

    patient_medications = relationship("PatientMedication", back_populates="medication")


class PatientMedication(Base):
    __tablename__ = "patient_medications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    medication_id = Column(UUID(as_uuid=True), ForeignKey("medications.id", ondelete="RESTRICT"), nullable=False)
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)

    patient = relationship("Patient", back_populates="patient_medications")
    medication = relationship("Medication", back_populates="patient_medications")


class GenomicData(Base):
    __tablename__ = "genomic_data"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), unique=True, nullable=False)
    genome_payload = Column(JSONB, nullable=False)
    
    patient = relationship("Patient", back_populates="genomic_data")


class Biomarker(Base):
    __tablename__ = "biomarkers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    biomarker_type = Column(String, nullable=False)
    readings = Column(JSONB, nullable=False)
    recorded_at = Column(TIMESTAMP(timezone=True), nullable=False)
    source = Column(String)

    patient = relationship("Patient", back_populates="biomarkers")


class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    input_payload = Column(JSONB, nullable=False)
    baseline_prediction = Column(JSONB, nullable=False)
    simulated_prediction = Column(JSONB, nullable=False)
    risk_flags = Column(JSONB, server_default='{}')

    patient = relationship("Patient", back_populates="simulations")
