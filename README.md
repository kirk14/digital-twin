# Digital Twin Clinical AI Engine

A production-ready, state-of-the-art Clinical Predictive Engine designed for longitudinal EHR data processing, disease trajectory forecasting, and pharmacological safety validation.

---

## 🚀 Quick Start (Evaluation)

To generate performance metrics and publication-ready visualizations:

1.  **Prepare Assets**: Ensure `model_checkpoint.pth` is in the root directory.
2.  **Execute Pipeline**:
    ```bash
    chmod +x run_evaluation.sh
    ./run_evaluation.sh
    ```
    This will generate: `learning_curve.png`, `trajectory_prediction.png`, and `shap_summary.png`.

---

## 🧩 Core Architecture

The system is built as a modular pipeline following clinical AI best practices:

### 1. Data Preprocessing (`dataset_pipeline.py`)
- **FHIR Alignment**: Converts raw Healthcare HL7/FHIR JSON bundles into standardized PyTorch tensors.
- **Temporal Engineering**: Automatically calculates time-deltas ($\Delta t$) between observations and aligns treatment flags with biomarker events.
- **Sequence Handling**: Implements a sliding window (default: 60 time steps) to maintain longitudinal context.

### 2. Time-Aware Transformer (`trajectory_transformer.py`)
- **Temporal Attention**: Utilizes a Transformer Encoder with multi-head attention over the historical $\Delta t$.
- **Quantile Regression**: Instead of single-point forecasts, the model predicts the 10th, 50th (median), and 90th percentiles of biomarker trajectories to quantify uncertainty.
- **Static Context**: Integrates patient-level static tokens (age, gender, genomics) into the transformer hidden state.

### 3. Pharmacovigilance Engine (`pharmacovigilance.py`)
- **The "Safety Net"**: A deterministic rule engine that validates proposed treatments against historical labs and patient-specific genomic risk markers.
- **Alert Levels**: Returns structured `PASS`, `WARNING` (Orange), or `FAIL` (Red) alerts based on clinical toxicity thresholds (e.g., eGFR failure, drug-drug interactions).

### 4. Patient Evaluation & Explainability (`model_evaluation.py`)
- **Metrics**: Calculates MSE and MAE for trajectory accuracy.
- **SHAP Interpretability**: Utilizes `SHAP (DeepExplainer)` to generate patient-level feature importance summaries, explaining why the model predicted a specific clinical outcome.

---

## 🛠 File Structure & Development

```text
├── dataset_pipeline.py      # FHIR Data Ingestion & Tensorization
├── trajectory_transformer.py # Transformer Model Architecture
├── model_evaluation.py      # Inference, Metrics, and Plotting
├── pharmacovigilance.py     # Clinical Safety-Net Rules
├── clinical_explainer.py    # SHAP-based Model Interpretability
├── run_evaluation.sh        # Automation script for evaluation
├── preprocessing.py         # Utility functions for data cleansing
└── api.py                   # FastAPI Gateway for Clinical Integration
```

---

## 🔒 Security & Compliance
- **Data Privacy**: Designed for HIPAA/GDPR readiness by ensuring PII is stripped during tensorization.
- **Auditability**: Every simulation generates a deterministic JSON log and a signed clinical report.