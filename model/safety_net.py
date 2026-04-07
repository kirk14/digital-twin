import json
from typing import List, Dict, Any, Optional, Tuple

class SafetyNet:
    """
    The Safety Net Rules Engine.
    Deterministic pharmacological logic layer running before ML simulation.
    Checks for DDI and Organ Function contraindications.
    """
    
    def __init__(self):
        # Mock DDI Database (RxNorm to RxNorm interaction flags)
        self.ddi_registry = {
            "Simvastatin": ["Amiodarone", "154943"], # Simvastatin (70618) interacts with Amiodarone (161)
            "Warfarin": ["Amiodarone"], # Warfarin interacts with Amiodarone
            "Aspirin": ["88014", "Warfarin"] # Aspirin (7955) interacts with Warfarin (11289)
        }
        
        # Renal dosage thresholds (eGFR in mL/min/1.73m^2)
        # drug_code: {egfr_limit: minimum_egfr, alert_msg: str}
        self.renal_thresholds = {
            "Metformin": { # Metformin (2002)
                "contraindication": 30,
                "warning": 45,
                "msg": "Risk of Lactic Acidosis. Metformin is contraindicated in eGFR < 30."
            },
            "Lisinopril": { # Lisinopril
                "warning": 30,
                "msg": "Monitor renal function closely. Consider dose reduction if eGFR < 30."
            }
        }

    def check_safety(self, proposed_drug: str, 
                     dosage_mg: float, 
                     active_meds: List[str], 
                     latest_egfr: float) -> Dict[str, Any]:
        """
        Runs the pharmacological safety checks.
        
        Args:
            proposed_drug: RxNorm code for the drug.
            dosage_mg: Numeric dosage value.
            active_meds: List of active RxNorm codes.
            latest_egfr: Latest laboratory eGFR value.
            
        Returns:
            alerts: Structured JSON alerts with severity.
        """
        alerts = []
        
        # 1. Drug-Drug Interaction Check
        interactions = self.ddi_registry.get(proposed_drug, [])
        for active in active_meds:
            if active in interactions:
                alerts.append({
                    "type": "DDI",
                    "severity": "RED",
                    "code": "A01",
                    "message": f"Major Interaction Detected: {proposed_drug} vs {active}."
                })
                
        for active in active_meds:
            active_interactions = self.ddi_registry.get(active, [])
            if proposed_drug in active_interactions:
                msg = f"Major Interaction Detected: {active} vs {proposed_drug}."
                if not any(a.get("message") == msg for a in alerts) and not any(a.get("message") == f"Major Interaction Detected: {proposed_drug} vs {active}." for a in alerts):
                    alerts.append({
                        "type": "DDI",
                        "severity": "RED",
                        "code": "A01",
                        "message": msg
                    })
        
        # 2. Organ Function Safeguard (Renal)
        if proposed_drug in self.renal_thresholds:
            config = self.renal_thresholds[proposed_drug]
            
            if "contraindication" in config and latest_egfr < config["contraindication"]:
                alerts.append({
                    "type": "RENAL_SAFEGUARD",
                    "severity": "RED",
                    "code": "R01",
                    "message": f"CRITICAL: {config['msg']} (Active eGFR: {latest_egfr})"
                })
            elif "warning" in config and latest_egfr < config["warning"]:
                alerts.append({
                    "type": "RENAL_SAFEGUARD",
                    "severity": "ORANGE",
                    "code": "R02",
                    "message": f"WARNING: {config['msg']} (Active eGFR: {latest_egfr})"
                })
        
        # 3. Default safe response if no alerts
        if not alerts:
            return {
                "safe": True,
                "alerts": [],
                "status": "PASS"
            }
        
        return {
            "safe": False if any(a["severity"] == "RED" for a in alerts) else True,
            "alerts": alerts,
            "status": "FLAGGED"
        }

if __name__ == "__main__":
    # Test Safety Net
    sn = SafetyNet()
    
    # Case 1: DDI Conflict (Simvastatin + Amiodarone)
    result_ddi = sn.check_safety("Simvastatin", 40.0, ["Amiodarone"], 90.0)
    print(f"DDI Test (Simvastatin+Amiodarone): {json.dumps(result_ddi, indent=2)}")
    
    # Case 2: Renal Conflict (Metformin + Low eGFR)
    result_renal = sn.check_safety("Metformin", 500.0, ["Insulin"], 25.0)
    print(f"Renal Test (Metformin eGFR 25): {json.dumps(result_renal, indent=2)}")
