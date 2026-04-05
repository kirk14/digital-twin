### 1. Database Implementation (PostgreSQL)

Since you are dealing with sensitive healthcare data and complex unstructured arrays (genomics), setting up a robust, secure database is the first step.

*   **Step 1.1: Environment Setup & Security:**
    *   Deploy a PostgreSQL instance with local volume encryption (data at rest).
    *   Configure TLS 1.3 for all database connections.
    *   Establish Row-Level Security (RLS) and database-level RBAC to ensure different provider roles only see authorized patient profiles.
*   **Step 1.2: Relational Schema Design (SQL):**
    *   **`patients`:** Demographics, historical baselines, consent flags.
    *   **`providers`:** IAM data, specialization, contact info.
    *   **`ehr_records`:** Historical diagnoses (ICD-10 codes), clinical notes, and treatment histories.
    *   **`medications`:** Drug catalogs, baseline dosage guidelines, known interaction flags.
*   **Step 1.3: Semi-Structured Schema Design (JSONB):**
    *   **`genomic_data`:** Use `JSONB` to store complex genetic sequencing structures, specific gene variants, and metabolic markers (e.g., CYP450 enzyme status for drug metabolism).
    *   **`biomarkers`:** Time-series arrays of labs, assays, and continuous wearable data payloads.

### 2. Backend Implementation (FastAPI - Ground Up)

You are scratching the existing wellness-tracker backend. The new backend must serve as a secure clinical API Gateway and orchestration layer.

*   **Step 2.1: Project Skeleton & Security Architecture:**
    *   Initialize a new FastAPI project utilizing a modular architecture (e.g., separating Routers, Services, Repositories, and ML connectors).
    *   Implement robust IAM using OAuth2/JWT (e.g., integrating Auth0 or Keycloak).
    *   Create RBAC middleware to restrict endpoints (e.g., `Admin`, `Managing Physician`, `Lab Technician`).
    *   Implement data anonymization middleware to strip Personally Identifiable Information (PII) before sending payloads to the ML engine (for HIPAA/GDPR readiness).
*   **Step 2.2: Data Access Layer (ORM):**
    *   Integrate `SQLAlchemy` or `SQLModel`.
    *   Set up schemas to handle standard relational queries and advanced `JSONB` querying for biomarker filtering.
*   **Step 2.3: Ingestion & Integration APIs:**
    *   Create `POST /api/v1/ingest/ehr` for batch FHIR/HL7 record processing.
    *   Create `POST /api/v1/ingest/genomics` for uploading and parsing sequenced files.
*   **Step 2.4: Simulation & Analytics Endpoints:**
    *   Create `POST /api/v1/simulate`: Accepts patient ID, target medication, and dosage. Orchestrates the call to the ML Engine and returns the simulated physiological response.
    *   Create `GET /api/v1/reports/{patient_id}`: Triggers the generation of a downloadable PDF report with embedded Matplotlib/Seaborn visualisations.

### 3. AI & ML Model (The Digital Twin Engine)

This is the computational core replacing the rudimentary Scikit-Learn fitness script.

*   **Step 3.1: Data Preprocessing Pipeline:**
    *   Build a Python/Pandas job that takes a patient's relational EHR data, JSONB genomic markers, and time-series biomarkers and flattens them into a unified, normalized `$PatientVector`.
*   **Step 3.2: Baseline Trajectory Model:**
    *   Train a predictive model (using TensorFlow/PyTorch or advanced Scikit-Learn ensembles) on historical cohort data.
    *   **Objective:** Predict the patient's long-term disease progression (e.g., 5-year and 10-year cardiovascular or metabolic risk) *without* intervention.
*   **Step 3.3: Generative Simulation Engine:**
    *   Develop a model module that accepts the `$PatientVector` + `$ProposedTreatment` (drug, dosage).
    *   Simulate the impact of the medication on clinical biomarkers (e.g., predicted drop in blood pressure, liver enzyme response).
*   **Step 3.4: The "Safety Net" Rules Engine:**
    *   Build a pharmacological logic layer. Before returning the simulation, this script cross-references the patient's genomic data (e.g., poor metabolizer status) and current medications against the proposed drug to flag interactions, allergic reactions, or toxicity risks.

### 4. Frontend Implementation (Clinical Dashboard)

**⚠ MAJOR CHANGES REQUIRED:** The frontend must transition from a consumer-style "wellness tracker" to a heavy-data, professional Clinical Predictive Dashboard.

*   **Change 1: Authentication & RBAC UI**
    *   *Old:* Single user view, or no auth.
    *   *New:* Enterprise login portal (MFA/SSO). UI must dynamically render based on provider role constraints.
*   **Change 2: Shift to a "Patient Roster" Architecture**
    *   *Old:* Global dashboard for "My Health".
    *   *New:* A "Provider Home" displaying a list of assigned patients, searchable by ID, name, or risk category. Clicking a patient opens their specific Digital Twin workspace.
*   **Change 3: Detailed Patient Overview (The Twin Profile)**
    *   *New UI Component:* A comprehensive header/sidebar showing static EHR demographics, active diagnoses, an aggregated "Genomic Risk Profile" summary, and current real-time distinct biomarkers.
*   **Change 4: Predictive Trajectory Charting (The Core View)**
    *   *Old:* Basic bar charts of steps and sleep.
    *   *New:* Integration of an advanced charting library (Recharts, Chart.js, or Plotly).
    *   *Requirement:* A multi-line time-series graph that displays standard physiological baselines mapping out 1–5 years into the future.
*   **Change 5: The "Scenario Runner" UI (Treatment Simulation)**
    *   *Old:* Static buttons ("Add 3000 steps").
    *   *New:* A clinical command center.
        *   **Form Inputs:** Dropdowns for "Medication Class", "Specific Drug", and sliders/inputs for "Dosage (mg/mcg)" and "Frequency".
        *   **Action:** A "Run Simulation (Digital Twin)" button.
        *   **Output Render:** Splits the prediction chart to show *Baseline Trajectory* (without drug) vs. *Simulated Trajectory* (with drug) overlaid on each other.
*   **Change 6: Implementing the "Safety Net" Alerts**
    *   *New UI Component:* Prominent visual banners (Red/Orange/Yellow severity) that appear immediately upon running a simulation.
    *   *Functionality:* Clearly display text such as *"⚠ HIGH ALLERGY RISK: Patient genomic marker XYZ contraindicates current dosage."*
*   **Change 7: Reporting Interface**
    *   *New Action:* A "Generate Clinical Report" button that fetches the backend-generated PDF representing the patient's stats, the simulated treatments, and the statistical probabilities of efficacy, easily printable for the patient or records.