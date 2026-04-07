import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import List, Dict, Any, Tuple

def get_device():
    """Returns the most capable available device (MPS, CUDA, or CPU)."""
    if torch.backends.mps.is_available():
        return torch.device("mps")
    elif torch.cuda.is_available():
        return torch.device("cuda")
    return torch.device("cpu")

class QuantileLoss(nn.Module):
    """
    Pinned (Pinball) Loss for Quantile Regression.
    Computes loss for q=0.1, 0.5, 0.9.
    """
    def __init__(self, quantiles: List[float] = [0.1, 0.5, 0.9]):
        super().__init__()
        self.quantiles = quantiles

    def forward(self, preds: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
        """
        preds: [batch, horizon, metrics, 3]
        target: [batch, horizon, metrics]
        """
        losses = []
        for i, q in enumerate(self.quantiles):
            errors = target - preds[..., i]
            losses.append(torch.max((q - 1) * errors, q * errors))
        return torch.mean(torch.stack(losses).sum(dim=0))

class TimeAwareTransformer(nn.Module):
    """
    Clinical Trajectory Model with Temporal Awareness and Quantile Regression.
    
    Architecture:
    1. Feature Embedding + Positional Encoding
    2. Transformer Encoder Layers
    3. Multi-head attention over historical temporal delta (Δt)
    4. Quantile Regression Output (10th, 50th, 90th percentiles)
    """
    
    def __init__(self, 
                 static_dim: int, 
                 temporal_dim: int, 
                 hidden_dim: int = 128, 
                 n_heads: int = 4, 
                 n_layers: int = 3,
                 output_horizon: int = 5):
        super().__init__()
        
        self.temporal_dim = temporal_dim
        self.output_horizon = output_horizon
        
        # 1. Input Processing
        # temporal_dim includes biomarkers + delta_t + treatment
        self.input_projection = nn.Linear(temporal_dim, hidden_dim)
        self.static_projection = nn.Linear(static_dim, hidden_dim)
        
        # 2. Transformer Core
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=hidden_dim, 
            nhead=n_heads, 
            dim_feedforward=hidden_dim * 4,
            dropout=0.1,
            batch_first=True
        )
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=n_layers)
        
        # 3. Trajectory Regressor
        # Predicts (horizon, biomarkers, 3) for the 3 quantiles.
        # We predict deltas for biomarkers (excluding delta_t and treatment flags in output)
        self.num_biomarkers = temporal_dim - 2 
        self.regressor = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, output_horizon * self.num_biomarkers * 3)
        )

    def forward(self, static_x: torch.Tensor, temporal_x: torch.Tensor) -> torch.Tensor:
        """
        Args:
            static_x: [Batch, static_dim]
            temporal_x: [Batch, seq_len, temporal_dim] (includes Δt and treatment flags)
            
        Returns:
            quantiles: [Batch, output_horizon, num_biomarkers, 3]
        """
        batch_size = temporal_x.shape[0]
        
        # 1. Project inputs
        # temporal_proj: [Batch, seq_len, hidden_dim]
        temporal_proj = self.input_projection(temporal_x) 
        
        # 2. Integrate static context
        # static_proj: [Batch, 1, hidden_dim]
        static_proj = self.static_projection(static_x).unsqueeze(1)
        
        # Concatenate static context as a 'global patient token'
        # [Batch, seq_len + 1, hidden_dim]
        combined = torch.cat([static_proj, temporal_proj], dim=1)
        
        # 3. Transformer Reasoning
        # features: [Batch, seq_len + 1, hidden_dim]
        features = self.transformer_encoder(combined)
        
        # 4. Global Pooling / Take the last token (representation of current state)
        last_state = features[:, -1, :] # [Batch, hidden_dim]
        
        # 5. Quantile Regression
        # preds_flat: [Batch, horizon * biomarkers * 3]
        preds_flat = self.regressor(last_state)
        
        # Reshape to [Batch, horizon, biomarkers, 3]
        preds = preds_flat.view(batch_size, self.output_horizon, self.num_biomarkers, 3)
        
        return preds

if __name__ == "__main__":
    device = get_device()
    print(f"Using device: {device}")
    
    # Example Config
    # temporal_dim: 12 biomarkers + Δt + treatment = 14
    model = TimeAwareTransformer(static_dim=2, temporal_dim=14, output_horizon=5).to(device)
    
    # Mock Batch
    batch_size = 8
    s_x = torch.randn(batch_size, 2).to(device)
    t_x = torch.randn(batch_size, 60, 14).to(device)
    
    output = model(s_x, t_x)
    print(f"Output Shape (Batch, Horizon, Biomarkers, Quantiles): {output.shape}")
    # Expected: [8, 5, 12, 3]
