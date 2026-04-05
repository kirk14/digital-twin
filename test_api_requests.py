import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def check_health():
    try:
        req = urllib.request.Request(f"{BASE_URL}/")
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print("API is UP and responding!")
                return True
    except urllib.error.URLError:
        print("API is down! Make sure uvicorn is running.")
        return False

def make_post_request(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def test_simulate_happy_path():
    print("\n--- [POST] Testing Happy Path (APPROVED) ---")
    payload = {
        "patient_id": "P12345",
        "proposed_drug": "10001",
        "dosage_mg": 50.0,
        "active_meds": [],
        "latest_labs": {"egfr": 95.0}
    }
    
    status_code, resp_data = make_post_request(f"{BASE_URL}/simulate", payload)
    print(f"Status Code: {status_code}")
    print("Response payload:")
    print(json.dumps(resp_data, indent=2))

def test_simulate_organ_failure_block():
    print("\n--- [POST] Testing Organ Failure (BLOCKED) ---")
    payload = {
        "patient_id": "P67890",
        "proposed_drug": "Metformin", # Metformin
        "dosage_mg": 500.0,
        "active_meds": [],
        "latest_labs": {"egfr": 25.0} # Trigger RED flag
    }
    
    status_code, resp_data = make_post_request(f"{BASE_URL}/simulate", payload)
    print(f"Status Code: {status_code}")
    print("Response payload:")
    print(json.dumps(resp_data, indent=2))


def test_simulate_null_labs():
    print("\n--- [POST] Testing Null Lab Data (FLAGGED/BLOCKED) ---")
    payload = {
        "patient_id": "PT-006",
        "proposed_drug": "Metformin",
        "dosage_mg": 500,
        "active_meds": [],
        "latest_labs": {
            "egfr": None,
            "alt": None,
            "ast": None
        }
    }
    
    status_code, resp_data = make_post_request(f"{BASE_URL}/simulate", payload)
    print(f"Status Code: {status_code}")
    print("Response payload:")
    print(json.dumps(resp_data, indent=2))


if __name__ == "__main__":
    if check_health():
        time.sleep(1) # Tiny pause before blasting data
        test_simulate_happy_path()
        test_simulate_organ_failure_block()
        test_simulate_null_labs()
