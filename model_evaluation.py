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
    print("Generating mock data and building graphs...")
    

    np.random.seed(42)
    actual = np.random.normal(50, 5, 20)
    predicted = actual + np.random.normal(0, 2, 20)
    p10 = predicted - 5
    p90 = predicted + 5

    
    calculate_metrics(actual, predicted)
    plot_learning_curve([10, 8, 6, 5, 4, 3, 2.5, 2.1, 1.9, 1.8], [12, 9, 7, 7, 8, 5, 4.5, 3.8, 3.5, 3.4])
    plot_trajectory_prediction(range(len(actual)), actual, predicted, p10, p90)