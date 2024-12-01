import pytest
import requests

# Base API configuration
BASE_URL = "https://dev-gs.qa-playground.com/api/v1"
USER_UUID = "c0549e0d-0601-470c-b242-f5e28715d449"
HEADERS = {
    "Authorization": "Bearer qahack2024:proxy.vqz2d@simplelogin.com",
    "X-Task-Id": "api-17"
}

def test_list_orders_success():
    response = requests.get(f"{BASE_URL}/users/{USER_UUID}/orders", headers=HEADERS)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert "orders" in json_data, "Missing 'orders' in response"
    assert "meta" in json_data, "Missing 'meta' in response"
    assert isinstance(json_data["orders"], list), "'orders' should be a list"

def test_invalid_user_uuid():
    invalid_uuid = "997769a2-d303-4686-b410-c6616a5bda99"
    response = requests.get(f"{BASE_URL}/users/{invalid_uuid}/orders", headers=HEADERS)
    assert response.status_code == 404, f"Unexpected status code: {response.status_code}"

def test_empty_orders():
    user_with_no_orders = "407769a2-d303-4686-b410-c6616a5bdab0"
    response = requests.get(f"{BASE_URL}/users/{user_with_no_orders}/orders", headers=HEADERS)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert json_data["orders"] == [], "Expected empty orders list"

def test_limit():
    params = {"offset": 5, "limit": 3}
    response = requests.get(f"{BASE_URL}/users/{USER_UUID}/orders", headers=HEADERS, params=params)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert len(json_data["orders"]) <= 3, "Returned more orders than the limit"

def test_sorting_order():
    response = requests.get(f"{BASE_URL}/users/{USER_UUID}/orders", headers=HEADERS)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    orders = response.json()["orders"]
    timestamps = [order["created_at"] for order in orders]
    assert timestamps == sorted(timestamps, reverse=True), "Orders are not sorted by newest first"

def test_large_offset():
    params = {"offset": 1000000, "limit": 10}
    response = requests.get(f"{BASE_URL}/users/{USER_UUID}/orders", headers=HEADERS, params=params)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    json_data = response.json()
    assert json_data["orders"] == [], "Expected no orders for a large offset"

def test_rate_limiting():
    responses = []
    for _ in range(5):
        response = requests.get(f"{BASE_URL}/users/{USER_UUID}/orders", headers=HEADERS)
        responses.append(response)
    status_codes = [response.status_code for response in responses]
    assert all(code == 200 for code in status_codes), "Unexpected status code in rapid requests"

def test_offset():
    params = {"offset": 5, "limit": 5}
    response = requests.get(f"{BASE_URL}/users/{USER_UUID}/orders", headers=HEADERS, params=params)
    assert response.status_code == 200
    json_data = response.json()
    assert len(json_data["orders"]) <= 5, "Expected at most 5 orders"

def test_limit():
    params = {"limit": 3}
    response = requests.get(f"{BASE_URL}/users/{USER_UUID}/orders", headers=HEADERS, params=params)
    assert response.status_code == 200
    json_data = response.json()
    assert len(json_data["orders"]) == 3, "Expected exactly 3 orders"

def test_pagination():
    params_page1 = {"offset": 0, "limit": 3}
    response_page1 = requests.get(f"{BASE_URL}/users/{USER_UUID}/orders", headers=HEADERS, params=params_page1)
    assert response_page1.status_code == 200
    orders_page1 = response_page1.json()["orders"]
    params_page2 = {"offset": 3, "limit": 3}
    response_page2 = requests.get(f"{BASE_URL}/users/{USER_UUID}/orders", headers=HEADERS, params=params_page2)
    assert response_page2.status_code == 200
    orders_page2 = response_page2.json()["orders"]
    assert orders_page1[-1]["uuid"] != orders_page2[0]["uuid"], "Pagination overlap found"
    assert len(orders_page1) + len(orders_page2) == 6, "Expected 6 total orders from both pages"



if __name__ == "__main__":
    pytest.main()
