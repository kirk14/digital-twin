"""
RandomForest health scoring model.

The model outputs a continuous health score (0–100).
Internally it learns a classification label (0–4 buckets)
then maps back to a score range with added precision from
class probabilities.
"""
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from utils import normalize_inputs, MODEL_PATH


# Bucket boundaries for label → score centre mapping
BUCKET_CENTRES = [20.0, 45.0, 62.5, 77.5, 92.5]  # Poor→Excellent


class HealthModel:
    def __init__(self):
        self.clf: RandomForestClassifier | None = None

    # ------------------------------------------------------------------
    # Training
    # ------------------------------------------------------------------
    def fit(self, X: np.ndarray, y: np.ndarray) -> None:
        """Fit the RandomForest on feature matrix X and bucket labels y."""
        self.clf = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_leaf=5,
            random_state=42,
            n_jobs=-1,
        )
        self.clf.fit(X, y)

    # ------------------------------------------------------------------
    # Inference
    # ------------------------------------------------------------------
    def predict_score(self, input_dict: dict) -> float:
        """
        Convert raw input dict to a health score (0–100).

        Strategy:
        - Get class probability vector from the forest
        - Score = weighted average of bucket centres
        - Clamp to [0, 100]
        """
        if self.clf is None:
            raise RuntimeError("Model not trained. Call fit() or load().")

        features = normalize_inputs(input_dict)
        probs = self.clf.predict_proba(features)[0]  # shape: (n_classes,)

        # Weighted average over bucket centres
        centres = np.array(BUCKET_CENTRES[: len(probs)])
        score = float(np.dot(probs, centres))
        return round(max(0.0, min(100.0, score)), 1)

    # ------------------------------------------------------------------
    # Persistence
    # ------------------------------------------------------------------
    def save(self, path: str = MODEL_PATH) -> None:
        with open(path, "wb") as f:
            pickle.dump(self.clf, f)
        print(f"[HealthModel] Saved to {path}")

    def load(self, path: str = MODEL_PATH) -> None:
        with open(path, "rb") as f:
            self.clf = pickle.load(f)
        print(f"[HealthModel] Loaded from {path}")
