import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
import shap
import torch
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Configure seaborn for a professional, academic look
sns.set_theme(style="whitegrid", palette="muted")
plt.rcParams.update({
    "figure.titlesize": 16,
    "axes.titlesize": 16,
    "axes.labelsize": 14,
    "xtick.labelsize": 12,
    "ytick.labelsize": 12,
    "legend.fontsize": 12
})

def calculate_metrics(actual_labs, pred_median):
    """
    Calculates Mean Squared Error (MSE) and Mean Absolute Error (MAE).
    
    Args:
        actual_labs (array-like): Ground truth values.
        pred_median (array-like): Predicted median values.
        
    Returns:
        tuple: (MSE, MAE)
    """
    mse = mean_squared_error(actual_labs, pred_median)
    mae = mean_absolute_error(actual_labs, pred_median)
    
    print("=" * 40)
    print("         Model Evaluation Metrics")
    print("=" * 40)
    print(f"Mean Squared Error (MSE): {mse:.4f}")
    print(f"Mean Absolute Error (MAE) : {mae:.4f}")
    print("=" * 40)
    
    return mse, mae


def plot_learning_curve(train_losses, val_losses, filepath="learning_curve.png"):
    """
    Plots the training and validation loss over epochs.
    
    Args:
        train_losses (list or array-like): Training loss values.
        val_losses (list or array-like): Validation loss values.
        filepath (str): Path to save the generated plot.
    """
    epochs = range(1, len(train_losses) + 1)
    
    plt.figure(figsize=(10, 6))
    
    # Plot losses
    plt.plot(epochs, train_losses, label="Training Loss", color="royalblue", linewidth=2.5)
    plt.plot(epochs, val_losses, label="Validation Loss", color="darkorange", linewidth=2.5)
    
    # Styling and Labels
    plt.title("Model Learning Curve", fontweight="bold", pad=15)
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend(frameon=True, shadow=True, edgecolor="black")
    
    plt.tight_layout()
    plt.savefig(filepath, dpi=300, bbox_inches="tight")
    plt.close()
    
    print(f"[*] Learning curve saved successfully to: {filepath}")


def plot_trajectory_prediction(time_steps, actual_labs, pred_median, 
                               pred_10th, pred_90th, filepath="trajectory_prediction.png"):
    """
    Plots a patient's trajectory over time with predicted vs actuals and an 80% CI ribbon.
    
    Args:
        time_steps (array-like): Time steps for the trajectory.
        actual_labs (array-like): Actual measured lab values.
        pred_median (array-like): Model predicted median values.
        pred_10th (array-like): Predicted 10th percentile values limit.
        pred_90th (array-like): Predicted 90th percentile values limit.
        filepath (str): Path to save the generated plot.
    """
    plt.figure(figsize=(12, 6))
    
    # Plot Confidence Interval (80% Ribbon)
    plt.fill_between(time_steps, pred_10th, pred_90th, 
                     color="lightsteelblue", alpha=0.5, label="80% Confidence Interval")
    
    # Plot Predicted Median
    plt.plot(time_steps, pred_median, color="tomato", linestyle="--", 
             linewidth=2.5, label="Predicted Median")
    
    # Plot Actual Labs
    plt.plot(time_steps, actual_labs, color="darkslategray", marker="o", 
             markersize=8, linestyle="-", linewidth=2, label="Actual Labs")
    
    # Styling and Labels
    plt.title("Patient Trajectory: Actual vs Predicted Flow", fontweight="bold", pad=15)
    plt.xlabel("Time Steps")
    plt.ylabel("Biomarker Value")
    
    plt.legend(loc="best", frameon=True, shadow=True, edgecolor="black")
    
    plt.tight_layout()
    plt.savefig(filepath, dpi=300, bbox_inches="tight")
    plt.close()
    
    print(f"[*] Trajectory prediction plot saved successfully to: {filepath}")


def plot_shap_summary(model, background_tensor, test_tensor, feature_names, filepath="shap_summary.png"):
    """
    Generates a SHAP summary plot showing global feature importance.
    
    Args:
        model (torch.nn.Module): The trained PyTorch model.
        background_tensor (torch.Tensor): Patient data tensor to be used as a background baseline.
        test_tensor (torch.Tensor): The sample tensor for which we want to explain predictions.
        feature_names (list of str): List mapping indices to human-readable feature names.
        filepath (str): Path to save the generated plot.
    """
    # Ensure model is in eval mode and gradients are expected (SHAP requires this depending on explainer)
    model.eval()
    
    try:
        # Initialize DeepExplainer - highly compatible with PyTorch models
        explainer = shap.DeepExplainer(model, background_tensor)
        
        # Calculate SHAP values
        shap_values = explainer.shap_values(test_tensor)
        
        # Prep for plotting. If Shap returns a list (e.g. multiclass / multioutput), 
        # extract the first output index for simplicity (common in regression).
        if isinstance(shap_values, list):
            shap_values_to_plot = shap_values[0]
        else:
            shap_values_to_plot = shap_values
            
        # Convert tensor to numpy for plotting with SHAP package
        test_numpy = test_tensor.detach().cpu().numpy()
        
        # Generating SHAP plot requires its own internal handling. Use show=False to save.
        plt.figure(figsize=(10, 8))
        shap.summary_plot(shap_values_to_plot, test_numpy, feature_names=feature_names, show=False)
        
        # Adjust dimensions safely 
        fig = plt.gcf()
        fig.set_size_inches(12, 8)
        
        plt.title("SHAP Summary: Feature Importance", fontweight="bold", pad=20)
        plt.tight_layout()
        
        plt.savefig(filepath, dpi=300, bbox_inches="tight")
        plt.close()
        
        print(f"[*] SHAP summary plot saved successfully to: {filepath}")
        
    except Exception as e:
        print(f"Error generating SHAP plot: {e}")
        plt.close()

# Sample usage execution block 
if __name__ == "__main__":
    from model.trajectory_transformer import TimeAwareTransformer
    import os

    # 1. Core Configuration & Device Selection
    device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")
    print(f"[*] Running inference on: {device}")

    # 2. Model Initialization & Weight Loading
    # Architecture params: static_dim=2, temporal_dim=14, output_horizon=5
    model = TimeAwareTransformer(static_dim=2, temporal_dim=14, output_horizon=5).to(device)
    
    if os.path.exists('model_checkpoint.pth'):
        model.load_state_dict(torch.load('model_checkpoint.pth', map_location=device))
        model.eval()
        print("[+] Model loaded successfully and set to evaluation mode.")
    else:
        print("[!] CRITICAL: 'model_checkpoint.pth' not found in root directory.")

    # 3. Real Patient Data Loading
    # Expected structure from dataset_pipeline.py: {"static": tensor, "temporal": tensor}
    try:
        patient_batch = torch.load('processed_dir/PT-001.pt', map_location=device)
        static_x = patient_batch['static'].unsqueeze(0).to(device)    # Add batch dimension [1, 2]
        temporal_x = patient_batch['temporal'].unsqueeze(0).to(device) # Add batch dimension [1, 60, 14]
        print("[+] Successfully loaded PT-001.pt.")
    except Exception as e:
        print(f"[!] Error loading patient tensor: {e}")
        # Fallback for structural testing if file is missing
        static_x = torch.zeros(1, 2).to(device)
        temporal_x = torch.zeros(1, 60, 14).to(device)

    # 4. Inference (Quantile Prediction)
    with torch.no_grad():
        # Output: [Batch, Horizon, Biomarkers, Quantiles]
        preds = model(static_x, temporal_x)
        
        # Extract and convert predictions to numpy (Targeting Biomarker Index 0)
        # Quantile Mapping: Index 0 = 10th, 1 = 50th (Median), 2 = 90th
        pred_median = preds[0, :, 0, 1].detach().cpu().numpy()
        pred_10th = preds[0, :, 0, 0].detach().cpu().numpy()
        pred_90th = preds[0, :, 0, 2].detach().cpu().numpy()

    # 5. Training History Loading (Loss Curves)
    # Replace these lists with logic to load from your history.json if saved
    train_losses = [1.5, 1.2, 0.9, 0.7, 0.6, 0.55, 0.52] 
    val_losses = [1.6, 1.4, 1.1, 0.85, 0.75, 0.72, 0.70]
    
    # Ground Truth Placeholder: In real evaluation, you would load these from a test set
    actual_labs = pred_median + np.random.normal(0, 0.1, len(pred_median))

    # 6. Execution of Plotting Functions
    print("[*] Generating publication-ready metrics and graphs...")
    calculate_metrics(actual_labs, pred_median)
    plot_learning_curve(train_losses, val_losses)
    plot_trajectory_prediction(range(len(pred_median)), actual_labs, pred_median, pred_10th, pred_90th)
    
    # SHAP Summary Analysis (uses tensors directly)
    feature_names = ["sys_bp", "dia_bp", "chol", "trig", "ldl", "hdl", 
                     "egfr", "weight", "bmi", "hba1c", "gluc", "creat", 
                     "delta_t", "treatment"]
    plot_shap_summary(model, temporal_x, temporal_x, feature_names)
