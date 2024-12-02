16. API-16 Create a New Order
API Endpoint: `/users/{userId}/orders`
Method: POST
Description: This API creates a new order for a user by specifying a list of items.
 
      1. Create order success: 
         - Verifies that an order is created successfully for a valid user with valid item data.
         - Expectation: `status 200`, `order status 'open'`.
      
      2. Create order with invalid item: 
         - Tries to create an order with an invalid item UUID.
         - Expectation: `status 404`.

      3. Create order exceeding quantity limit: 
         - Tests an order creation with an item quantity exceeding the limit.
         - Expectation: `status 400 or 404`.

      4. Create order with missing items field: 
         - Attempts to create an order without specifying any items.
         - Expectation: `status 400 or 404`.

      5. Create order with invalid payload structure: 
         - Sends an order with an invalid payload structure.
         - Expectation: `status 400 or 404`.

      6. Create order with duplicate items: 
         - Tests creating an order with duplicate items in the request.
         - Expectation: `status 400 or 404`, with a `message` indicating duplication.


17. API-17 List Orders
 API Endpoint: `/users/{userId}/orders`
 Method: GET
 Description: This API lists all orders for a specific user.

      1. List orders success: 
         - Verifies that orders are fetched successfully for a valid user.
         - Expectation: `status 200`, `orders` should be an array.

      2. Invalid user UUID: 
         - Attempts to fetch orders using an invalid user UUID.
         - Expectation: `status 404`.

      3. Sorting order: 
         - Verifies that orders are returned in descending order of creation timestamp.
         - Expectation: `orders sorted` by `created_at`.

      4. Large offset: 
         - Tests with a large offset and expects an empty list of orders.
         - Expectation: `status 200`, `orders` should be an empty array.

      5. Rate limiting: 
         - Tests multiple consecutive requests to check for rate-limiting behavior.
         - Expectation: All responses should have `status 200`.

      6. Offset: 
         - Verifies that pagination with `offset` and `limit` works as expected.
         - Expectation: `orders.length <= limit`.



18. API-18 Update Order Status
API Endpoint: `/orders/{orderId}/status`
Method: PATCH
Description: This API updates the status of an order to a new value.

      1. Update order status to canceled fail: 
         - Attempts to update the order status to "canceled" when it's not allowed.
         - Expectation: `status 404` with an appropriate error message indicating "canceled" is not valid.
      2. Update order status to invalid status: 
         - Tries to update the order to an invalid status.
         - Expectation: `status 404`, with error code and message indicating "not found".
      3. Update completed order status: 
         - Tests updating the status of a completed order to "canceled".
         - Expectation: `status 404`, with an error message mentioning "completed".
      4. Update order status unauthorized: 
         - Verifies unauthorized status update attempt (without the proper authorization token).
         - Expectation: `status 401`, with a message saying "authentication failed".




