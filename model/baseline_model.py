import torch
import torch.nn as nn
from typing import List, Dict, Any, Tuple

class BiomarkerTrajectoryModel(nn.Module):
    """
    Baseline Trajectory Model for Digital Twin.
    Predicts the future biomarker states (1-5 year trajectory) assuming no new interventions.
    Architecture: GRU/LSTM Backbone for time-series + Demographic MLP.
    """
    
    def __init__(self, static_dim: int, temporal_dim: int, hidden_dim: int = 64, 
                 num_layers: int = 2, output_horizon: int = 5):
        super(BiomarkerTrajectoryModel, self).__init__()
        
        # RNN component to process temporal history (Labs/Vitals/Meds)
        self.rnn = nn.GRU(
            input_size=temporal_dim, 
            hidden_size=hidden_dim, 
            num_layers=num_layers, 
            batch_first=True,
            dropout=0.2 if num_layers > 1 else 0
        )
        
        # Demographic MLP to integrate Age, Sex, Race
        self.static_mlp = nn.Sequential(
            nn.Linear(static_dim, 32),
            nn.ReLU(),
            nn.BatchNorm1d(32)
        )
        
        # Integration Layer combining temporal context and static data
        self.integrator = nn.Sequential(
            nn.Linear(hidden_dim + 32, 128),
            nn.ReLU(),
            nn.Dropout(0.1)
        )
        
        # Multi-task Regressor for Future States
        # Output shape: [Batch, output_horizon, temporal_dim]
        # output_horizon: predicting fixed steps into the future (e.g., 5 years)
        self.regressor = nn.Linear(128, output_horizon * temporal_dim)
        self.output_horizon = output_horizon
        self.temporal_dim = temporal_dim

    def forward(self, static_x: torch.Tensor, temporal_x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass for the Digital Twin model.
        
        Args:
            static_x: [Batch, static_dim]
            temporal_x: [Batch, sequence_length, temporal_dim]
            
        Returns:
            trajectory_preds: [Batch, output_horizon, temporal_dim]
        """
        # 1. Process temporal data with GRU
        _, h_n = self.rnn(temporal_x) # h_n is [num_layers, batch, hidden_dim]
        temporal_context = h_n[-1] # Take last layer hidden state: [batch, hidden_dim]
        
        # 2. Process static data
        static_context = self.static_mlp(static_x) # [batch, 32]
        
        # 3. Concatenate and integrate
        combined = torch.cat([temporal_context, static_context], dim=1) # [batch, hidden_dim + 32]
        integrated = self.integrator(combined) # [batch, 128]
        
        # 4. Predict multi-task future values
        preds_flat = self.regressor(integrated) # [batch, horizon * temporal_dim]
        
        # Reshape to [batch, output_horizon, temporal_dim]
        preds = preds_flat.view(-1, self.output_horizon, self.temporal_dim)
        
        return preds

if __name__ == "__main__":
    # Test Forward Pass
    model = BiomarkerTrajectoryModel(static_dim=2, temporal_dim=12, output_horizon=12)
    s_x = torch.randn(1, 2)
    t_x = torch.randn(1, 60, 12)
    output = model(s_x, t_x)
    print(f"Prediction Tensor Shape: {output.shape}") 
    # Expected: [1, 12, 12] - 12 months prediction for 12 metrics
