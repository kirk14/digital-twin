# Database Setup – Digital Twin System

## Overview
This database serves as the core data layer for the Digital Twin System, a healthcare AI project. It securely and efficiently stores comprehensive data including patients, providers, electronic health records (EHR), medications, complex genomic sequences, time-series biomarkers, and advanced predictive simulation results.

## Requirements
* **PostgreSQL** installed and running on your system.
* **psql** CLI tool installed and accessible in your system's PATH.

## Environment Variables
The setup script utilizes the following environment variables (with sensible defaults if not explicitly set):
* `DB_USER` (default: postgres)
* `DB_PASSWORD` (default: password)
* `DB_HOST` (default: localhost)
* `DB_PORT` (default: 5432)

## Setup Instructions

**Step 1:** Clone the repository to your local machine.  
**Step 2:** Navigate to the project folder via terminal.  
**Step 3:** Ensure the `schema.sql` file exists in the directory.  
**Step 4:** Make the script executable.  
```bash
chmod +x setup_db.sh
```
**Step 5:** Run the setup script.  
```bash
./setup_db.sh
```

## What setup_db.sh Does
When executed, the script systematically:
1. Checks the PostgreSQL DB connection to verify credentials and availability.
2. Creates the target database (`digital_twin_db`) if it doesn't already exist.
3. Runs the `schema.sql` file to load structure.
4. Creates all required tables, extensions, enums, and indexes.

## Database Schema Overview

* **patients** - Core records containing patient demographics and consent flags.
* **providers** - Healthcare professionals (admins, physicians, lab technicians) utilizing the system.
* **ehr_records** - Encounter histories, clinical notes, and diagnosis codes tied to patient visits.
* **medications** - Reference catalog of standard drugs and their known interactions.
* **patient_medications** - Junction table acting as a ledger for patient active and historical prescriptions.
* **genomic_data** - Advanced genetic payloads and variants stored for tailored AI modeling.
* **biomarkers** - Time-series physiological readings (e.g., glucose, heart rate) sourced from wearables or labs.
* **simulations** - Digital predictive runs capturing input parameters, baselines, and simulated health outcomes.

## Notes
* **Unique Identification:** Uses standard `UUID` primary keys across all tables instead of auto-incrementing integers.
* **Scalable Data:** Leverages PostgreSQL's native `JSONB` specific types for highly flexible data components like genomics and biomarkers.
* **Application Layer:** Specifically designed for compatibility with **FastAPI** + **SQLAlchemy** ORM.
* **Idempotency:** The initialization logic is safe for re-running (it will detect existing configurations and won’t recklessly recreate or wipe a populated DB).
