#!/bin/bash

# Digital Twin Clinical AI - Evaluation Pipeline
# This script orchestrates the model inference and generates performance visualizations.

echo "--------------------------------------------------"
echo "Setting up Digital Twin Evaluation Environment..."
echo "--------------------------------------------------"

# 1. Activate Virtual Environment
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "[+] Virtual environment activated."
else
    echo "[!] Virtual environment 'venv' not found. Please run 'python -m venv venv' and install requirements."
    exit 1
fi

# 2. Verify Model Checkpoint
if [ ! -f "model_checkpoint.pth" ]; then
    echo "[!] ERROR: 'model_checkpoint.pth' not found. Ensure the trained model weights are in the root directory."
    exit 1
fi

# 3. Verify Data Directory
if [ ! -d "processed_dir" ]; then
    echo "[*] Creating 'processed_dir' for inference..."
    mkdir -p processed_dir
fi

# 4. Run Evaluation Script
echo "[*] Launching model_evaluation.py..."
python3 model_evaluation.py

if [ $? -eq 0 ]; then
    echo "--------------------------------------------------"
    echo "SUCCESS: Evaluation assets generated."
    echo "Files created:"
    echo "  - learning_curve.png"
    echo "  - trajectory_prediction.png"
    echo "  - shap_summary.png"
    echo "--------------------------------------------------"
else
    echo "--------------------------------------------------"
    echo "FAILED: An error occurred during evaluation."
    echo "--------------------------------------------------"
    exit 1
fi
