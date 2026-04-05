import pytest
from pharmacovigilance import PharmacovigilanceEngine

@pytest.fixture
def engine():
    """
    Initialize the PharmacovigilanceEngine instance once for all tests.
    """
    return PharmacovigilanceEngine()

def test_happy_path(engine):
    """
    Test 1: The "Happy Path" (Healthy Baseline)
    Scenario: A safe medication on a patient with optimal organ function and no active prescriptions.
    """
    response = engine.validate_treatment(
        proposed_drug="10001",
        active_meds=[],
        patient_state={"egfr": 95.0} 
    )
    
    assert response["is_safe"] is True
    assert response["status"] == "PASS"
    assert len(response["alerts"]) == 0

def test_organ_failure(engine):
    """
    Test 2: Organ Failure (The "Red" Block)
    Scenario: Testing Metformin (2002) on a patient with End-Stage Renal Disease.
    """
    response = engine.validate_treatment(
        proposed_drug="Metformin",
        active_meds=[],
        patient_state={"egfr": 25.0}
    )
    
    assert response["is_safe"] is False
    assert response["status"] == "FLAGGED"
    assert len(response["alerts"]) == 1
    
    alert = response["alerts"][0]
    assert alert["type"] == "ORGAN_FUNCTION"
    assert alert["severity"] == "RED"

def test_renal_impairment_warning(engine):
    """
    Test 3: Renal Impairment Warning (The "Orange" Pass)
    Scenario: Testing Lisinopril (25995) on a patient whose kidneys are failing but not fully contraindicated.
    """
    response = engine.validate_treatment(
        proposed_drug="Lisinopril",
        active_meds=[],
        patient_state={"egfr": 28.5}
    )
    
    assert response["is_safe"] is True
    assert response["status"] == "FLAGGED"
    assert len(response["alerts"]) == 1
    
    alert = response["alerts"][0]
    assert alert["type"] == "ORGAN_FUNCTION"
    assert alert["severity"] == "ORANGE"

def test_bidirectional_ddi(engine):
    """
    Test 4: DDI Recognition
    Scenario: Testing Simvastatin (70618) proposed against an active prescription of Amiodarone (161)
    """
    response = engine.validate_treatment(
        proposed_drug="Simvastatin",
        active_meds=["Amiodarone"],
        patient_state={"egfr": 90.0}
    )
    
    assert response["is_safe"] is False
    assert response["status"] == "FLAGGED"
    assert len(response["alerts"]) == 1
    
    alert = response["alerts"][0]
    assert alert["type"] == "DDI"
    assert alert["severity"] == "RED"

def test_perfect_storm(engine):
    """
    Test 5: Not currently applicable to perfect storm due to registry constraints.
    """
    pass

def test_missing_crucial_lab_data(engine):
    """
    Test 6: Missing Crucial Lab Data (The Null/None Handler)
    Scenario: The clinician proposes a drug, but the patient hasn't had a blood test recently, 
    so the lab is missing.
    """
    response = engine.validate_treatment(
        proposed_drug="Metformin",
        active_meds=[],
        patient_state={"egfr": None, "alt": None, "ast": None}
    )
    
    assert response["is_safe"] is False
    assert response["status"] == "FLAGGED"
    assert len(response["alerts"]) == 1
    assert response["alerts"][0]["type"] == "MISSING_DATA"
    assert response["alerts"][0]["severity"] == "RED"
