import requests

# Base API configuration
BASE_URL = "https://dev-gs.qa-playground.com/api/v1"
USER_UUID = "407769a2-d303-4686-b410-c6616a5bdab0"
ORDER_UUID = "963b1208-115d-4b69-a0f4-87150fea3225" 
HEADERS = {
    "Authorization": "Bearer qahack2024:proxy.vqz2d@simplelogin.com",
    "X-Task-Id": "api-16"
}

def test_update_order_status_to_canceled_fail():
    url = f"{BASE_URL}/orders/{ORDER_UUID}/status"
    payload = {
        "status": "canceled"
    }
    response = requests.patch(url, headers=HEADERS, json=payload)
    assert response.status_code == 400, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert "code" in json_data, "Error response is missing 'code'"
    assert "message" in json_data, "Error response is missing 'message'"
    assert json_data["code"] == 400, "Expected error code 400"
    assert "canceled" in json_data["message"], "Error message does not reference 'canceled'"

def test_update_order_status_success():
    url = f"{BASE_URL}/orders/{ORDER_UUID}/status"
    payload = {
        "status": "canceled"
    }
    response = requests.patch(url, headers=HEADERS, json=payload)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert json_data["status"] == "canceled", "Order status was not updated to 'canceled'"

def test_update_order_status_to_invalid_status():
    url = f"{BASE_URL}/orders/{ORDER_UUID}/status"
    payload = {
        "status": "invalid_status"
    }
    response = requests.patch(url, headers=HEADERS, json=payload)
    assert response.status_code == 400, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert "code" in json_data, "Error response is missing 'code'"
    assert "message" in json_data, "Error response is missing 'message'"
    assert json_data["code"] == 400, "Expected error code 400"
    assert "invalid_status" in json_data["message"], "Error message does not reference 'invalid_status'"

def test_update_completed_order_status():
    url = f"{BASE_URL}/orders/{ORDER_UUID}/status"
    payload = {
        "status": "canceled"
    }
    response = requests.patch(url, headers=HEADERS, json=payload)
    assert response.status_code == 400, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert "code" in json_data, "Error response is missing 'code'"
    assert "message" in json_data, "Error response is missing 'message'"
    assert "completed" in json_data["message"], "Error message does not mention completed orders"

def test_update_order_status_unauthorized():
    url = f"{BASE_URL}/orders/{ORDER_UUID}/status"
    payload = {
        "status": "canceled"
    }
    headers = {
        "Content-Type": "application/json"
    }  # Missing Authorization header
    response = requests.patch(url, headers=headers, json=payload)
    assert response.status_code == 401, f"Unexpected status code: {response.status_code}"
    assert "Unauthorized" in response.text, "Error message does not indicate lack of authorization"

if __name__ == "__main__":
    test_update_order_status_success()
    test_update_order_status_to_invalid_status()
    test_update_order_status_to_canceled_fail()
    test_update_completed_order_status()
    test_update_order_status_unauthorized()
    print("All tests passed!")
