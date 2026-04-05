import torch
import torch.nn as nn
from captum.attr import IntegratedGradients
from typing import List, Dict, Any, Tuple
import json

class ClinicalExplainer:
    """
    Explainability & Attribution Engine for Clinician Dashboard.
    
    Uses PyTorch Captum to identify key clinical drivers of the predicted trajectory.
    """
    
    def __init__(self, model: nn.Module, feature_labels: List[str]):
        """
        Args:
            model: The trained TimeAwareTransformer.
            feature_labels: Human-readable names for the temporal features.
        """
        self.model = model
        self.model.eval()
        self.feature_labels = feature_labels
        self.ig = IntegratedGradients(self._model_forward_wrapper)

    def _model_forward_wrapper(self, temporal_input, static_input):
        """
        Wrapper to handle the dual-input structure (Static + Temporal).
        Returns only the median quantile (50th) for attribution.
        """
        # Preds shape: [Batch, Horizon, Biomarkers, 3]
        preds = self.model(static_input, temporal_input)
        # Combine horizon and biomarkers for a single attribution value per feature
        # We attribute based on the final year's median prediction (horizon - 1)
        return preds[:, -1, :, 1].sum(dim=-1)

    def get_trajectory_drivers(self, static_tensor: torch.Tensor, 
                                temporal_tensor: torch.Tensor) -> Dict[str, Any]:
        """
        Returns a ranked list of clinical features that most heavily influenced 
        the model's prediction.
        
        Returns:
            ranked_drivers: JSON-compatible dictionary of feature importance.
        """
        # Ensure gradients are tracked for attribution
        temporal_tensor.requires_grad = True
        
        # Calculate Attributions (only for temporal features for clarity)
        # attributions: [Batch, Seq_Len, Feature_Dim]
        attributions, delta = self.ig.attribute(
            inputs=temporal_tensor,
            additional_forward_args=(static_tensor,),
            return_convergence_delta=True
        )
        
        # Aggregate across the sequence length (Summing or taking absolute max)
        # importance: [Feature_Dim]
        importance = attributions.abs().sum(dim=[0, 1]).detach().cpu().numpy()
        
        # Map to labels and sort
        drivers = []
        for i, val in enumerate(importance):
            if i < len(self.feature_labels):
                drivers.append({
                    "feature": self.feature_labels[i],
                    "importance_score": float(val)
                })
        
        # Sort by importance descending
        drivers = sorted(drivers, key=lambda x: x["importance_score"], reverse=True)
        
        return {
            "drivers": drivers,
            "convergence_delta": float(delta.abs().mean()),
            "metric": "Integrated Gradients (Captum)"
        }

if __name__ == "__main__":
    # Test Explainer
    from trajectory_transformer import TimeAwareTransformer
    
    # 12 biomarkers + Δt + treatment
    labels = [
        "creatinine", "diastolic_bp", "egfr", "glucose", "hba1c", "hdl_cholesterol",
        "ldl_cholesterol", "systolic_bp", "total_cholesterol", "triglycerides", 
        "weight", "bmi", "delta_t", "dosage_signal"
    ]
    
    model = TimeAwareTransformer(static_dim=2, temporal_dim=14)
    explainer = ClinicalExplainer(model, labels)
    
    # Mock inputs
    s_x = torch.randn(1, 2)
    t_x = torch.randn(1, 60, 14)
    
    explanation = explainer.get_trajectory_drivers(s_x, t_x)
    print(json.dumps(explanation, indent=2))
