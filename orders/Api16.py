import pytest
import requests

# Base API configuration
BASE_URL = "https://dev-gs.qa-playground.com/api/v1"
USER_UUID = "407769a2-d303-4686-b410-c6616a5bdab0"
HEADERS = {
    "Authorization": "Bearer qahack2024:proxy.vqz2d@simplelogin.com",
    "X-Task-Id": "api-16"
}

def test_create_order_success():
    url = f"{BASE_URL}/users/{USER_UUID}/orders"
    payload = {
        "items": [
            {"item_uuid": "1990ecdd-4d3d-4de2-91b9-d45d794c82bc", "quantity": 2},
            {"item_uuid": "0378c074-92d6-4d8c-b6d3-878c08dbe27f", "quantity": 1}
        ]
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert "uuid" in json_data, "Order UUID is missing in the response"
    assert json_data["status"] == "open", "Order status should be 'open' after creation"

def test_create_order_invalid_item():
    url = f"{BASE_URL}/users/{USER_UUID}/orders"
    payload = {
        "items": [
            {"item_uuid": "0378c074-92d6-4d8c-b6d3-878c08dbe11f", "quantity": 2}
        ]
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    assert response.status_code == 404, f"Unexpected status code: {response.status_code}"

def test_create_order_exceed_quantity_limit():
    """Test creating an order with item quantity exceeding the limit."""
    url = f"{BASE_URL}/users/{USER_UUID}/orders"
    payload = {
        "items": [
            {"item_uuid": "1990ecdd-4d3d-4de2-91b9-d45d794c82bc", "quantity": 101}
        ]
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    assert response.status_code == 400, f"Unexpected status code: {response.status_code}"

# def test_create_order_exceed_order_limit():
#     """Test creating more orders than the user is allowed."""
#     url = f"{BASE_URL}/users/{USER_UUID}/orders"
#     payload = {
#         "items": [
#             {"item_uuid": "1990ecdd-4d3d-4de2-91b9-d45d794c82bc", "quantity": 1}
#         ]
#     }
#     # Simulate creating orders beyond the limit
#     for _ in range(11):  # Assuming the limit is 10
#         response = requests.post(url, headers=HEADERS, json=payload)
#     assert response.status_code == 400, f"Unexpected status code: {response.status_code}"

def test_create_order_missing_items():
    url = f"{BASE_URL}/users/{USER_UUID}/orders"
    payload = {}  # Missing the 'items' field
    response = requests.post(url, headers=HEADERS, json=payload)
    assert response.status_code == 400, f"Unexpected status code: {response.status_code}"

def test_create_order_invalid_payload():
    """Test creating an order with invalid payload structure."""
    url = f"{BASE_URL}/users/{USER_UUID}/orders"
    payload = {
        "invalid_field": "some value"
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    assert response.status_code == 400, f"Unexpected status code: {response.status_code}"

def test_create_order_duplicate_items():
    """Test creating an order with duplicate item UUIDs."""
    url = f"{BASE_URL}/users/{USER_UUID}/orders"
    duplicate_item_uuid = "0378c074-92d6-4d8c-b6d3-878c08dbe27f"  # Replace with a valid item UUID
    payload = {
        "items": [
            {"item_uuid": duplicate_item_uuid, "quantity": 1},
            {"item_uuid": duplicate_item_uuid, "quantity": 2}
        ]
    }
    response = requests.post(url, headers=HEADERS, json=payload)
    
    # Validate response
    assert response.status_code == 400, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert "code" in json_data, "Error response is missing 'code'"
    assert "message" in json_data, "Error response is missing 'message'"
    assert json_data["code"] == 400, "Expected error code 400"
    assert duplicate_item_uuid in json_data["message"], f"Error message does not mention the duplicate UUID: {duplicate_item_uuid}"


if __name__ == "__main__":
    pytest.main()
