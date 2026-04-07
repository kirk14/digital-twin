import json
from typing import List, Dict, Any, Tuple, Optional


class PharmacovigilanceEngine:
    """
    Deterministic Safety Net & Rule-Based Pharmacovigilance.
    
    Executes clinical safety checks prior to ML trajectory simulation.
    Ensures adherence to pharmacological safety thresholds (Renal/Hepatic).
    """
    
    def __init__(self):
        # 1. DDI Registry (Mock RxNorm-to-RxNorm interactions)
        self.ddi_registry = {
            "Simvastatin": ["Amiodarone", "154943"], # Simvastatin interacts with Amiodarone
            "Warfarin": ["Amiodarone"],            # Warfarin interacts with Amiodarone
            "Aspirin": ["Warfarin", "88014"]   # Aspirin interacts with Warfarin
        }
        
        # 2. Lab Markers (LOINC Mapping)
        self.lab_keys = {
            "egfr": "62238-1",
            "alt": "1742-6",
            "ast": "1920-8"
        }
        
        # 3. Renal/Hepatic Contraindications
        # Minimum lab values required for safe administration
        self.safety_thresholds = {
            "Metformin": { # Metformin
                "egfr": {"min": 30.0, "severity": "RED", "msg": "Contraindicated in eGFR < 30."}
            },
            "Lisinopril": { # Lisinopril
                "egfr": {"min": 30.0, "severity": "ORANGE", "msg": "Use extreme caution. Potential Renal Impairment."}
            }
        }

    def check_interaction(self, proposed_med_code: str, active_meds: List[str]) -> List[Dict[str, Any]]:
        """
        Detects potential Drug-Drug Interactions (DDI).
        """
        alerts = []
        # Check if proposed drug interacts with active meds
        conflicts = self.ddi_registry.get(proposed_med_code, [])
        for active in active_meds:
            if active in conflicts:
                alerts.append({
                    "type": "DDI",
                    "code": "A01",
                    "severity": "RED",
                    "message": f"CRITICAL DDI: {proposed_med_code} vs {active}."
                })
                
        # Check if active meds interact with proposed drug (Bidirectional)
        for active in active_meds:
            active_conflicts = self.ddi_registry.get(active, [])
            if proposed_med_code in active_conflicts:
                msg = f"CRITICAL DDI: {active} vs {proposed_med_code}."
                # Avoid duplicates
                if not any(a.get("message") == msg for a in alerts) and not any(a.get("message") == f"CRITICAL DDI: {proposed_med_code} vs {active}." for a in alerts):
                    alerts.append({
                        "type": "DDI",
                        "code": "A01",
                        "severity": "RED",
                        "message": f"CRITICAL DDI: {active} vs {proposed_med_code}."
                    })
                    
        return alerts

    def check_organ_function(self, proposed_med_code: str, 
                               latest_labs: Dict[str, Optional[float]]) -> List[Dict[str, Any]]:
        """
        Verifies organ function (Renal/Hepatic) thresholds for the drug class.
        """
        alerts = []
        rules = self.safety_thresholds.get(proposed_med_code, {})
        
        for marker, threshold in rules.items():
            current_val = latest_labs.get(marker)
            if current_val is not None:
                if current_val < threshold["min"]:
                    alerts.append({
                        "type": "ORGAN_FUNCTION",
                        "code": "R01",
                        "severity": threshold["severity"],
                        "message": f"{threshold['msg']} (Active {marker}: {current_val})"
                    })
            else:
                alerts.append({
                    "type": "MISSING_DATA",
                    "code": "M01",
                    "severity": threshold["severity"],
                    "message": f"Missing crucial lab data for {marker}."
                })
        return alerts

    def validate_treatment(self, 
                           proposed_drug: str, 
                           active_meds: List[str], 
                           patient_state: Dict[str, Optional[float]]) -> Dict[str, Any]:
        """
        Comprehensive Safety Net API.
        
        Args:
            proposed_drug: Proposed drug RxNorm code.
            active_meds: List of currently active RxNorm codes.
            patient_state: Current lab markers (e.g. {"egfr": 45.0, "alt": 20.0}).
            
        Returns:
            validation_result: Pass/Fail status with structured alerts.
        """
        # Normalize inputs to prevent case-sensitivity bugs when called from UI/External tools
        proposed_drug = proposed_drug.title() if isinstance(proposed_drug, str) else proposed_drug
        active_meds = [m.title() if isinstance(m, str) else m for m in active_meds]
        patient_state = {k.lower() if isinstance(k, str) else k: v for k, v in patient_state.items()}

        all_alerts = []
        
        # 1. Run DDI
        all_alerts.extend(self.check_interaction(proposed_drug, active_meds))
        
        # 2. Run Organ Safeguards
        all_alerts.extend(self.check_organ_function(proposed_drug, patient_state))
        
        is_safe = not any(a["severity"] == "RED" for a in all_alerts)
        
        return {
            "is_safe": is_safe,
            "alerts": all_alerts,
            "status": "PASS" if is_safe and not all_alerts else ("FLAGGED" if all_alerts else "PASS")
        }

if __name__ == "__main__":
    # Test Pharmacovigilance
    pv = PharmacovigilanceEngine()
    
    # Case: Metformin + Low eGFR
    result = pv.validate_treatment(
        proposed_drug="Metformin", # Metformin
        active_meds=["Insulin"], # Insulin
        patient_state={"egfr": 25.0}
    )
    
    print(f"Safety Check (Metformin @ 25 eGFR): {json.dumps(result, indent=2)}")
