API Testing Documentation

This document outlines the test cases for API functionality, using Jest as the testing framework and Supertest for making HTTP requests. The tests ensure that the API behaves as expected, following the defined specifications and validating the correctness of different operations.

 Testing Setup:
- BASE_URL: The API server’s base URL, used to make requests in the test cases.
- Authorization Token: A bearer token for authentication, ensuring the requests are authorized to access protected endpoints.
- Supertest: A package used for making HTTP requests and verifying the responses from the API, allowing assertions to be made on the status code, response body, headers, and more.

 Test Structure:
1. Test Initialization: Test cases may include setup functions (like `beforeAll` or `beforeEach`) to initialize data, create users, or set up conditions required for testing.
2. Test Assertions: Each test case includes assertions using Jest's `expect` function to verify the response's correctness (e.g., checking if the status code is as expected or if the response body matches the criteria).
3. Error Handling: Tests also cover edge cases, such as invalid input or unexpected responses, ensuring the API returns appropriate error codes (e.g., `400` for bad requests).


1. API-1 Delete Users
API Endpoint: `/users/{userId}`  
Method: DELETE  
Description: This API deletes a user from the system based on the provided user ID. It also tests the deletion behavior, including valid and invalid cases.

1. Delete Existing User
   - Send a DELETE request to `/users/{createdUserId}` to delete an existing user.
   - Verify that the response status is `204` (No Content).
   - Verify that the user is successfully deleted by attempting to fetch the user, expecting a `404` (Not Found).
2. Delete Non-Existent User
   - Send a DELETE request to `/users/{nonExistentUserId}` where the user does not exist.
   - Verify that the response status is `400` (Bad Request).

3. Unauthorized Access
   - Send a DELETE request to `/users/{createdUserId}` with an invalid token.
   - Verify that the response status is `401` (Unauthorized).
 2. API-2 Search Games by Query
- API Endpoint: `/games/search`
- Method: `GET`
- Description: Searches for games based on a query string and returns matching results.

1. Search with valid query: 
   - Query: "Atomic Heart"
   - Expected: Returns all games where the title matches the query string.
   - Validation: The game titles should contain the query string.
   
2. Search with no matches:
   - Query: "NonExistentGame"
   - Expected: Returns an empty array when no games match the query.
   
3. Search with invalid query string:
   - Query: "%$InvalidQuery"
   - Expected: Returns a 400 status for an invalid query parameter.
   
4. Search with empty query string:
   - Query: ""
   - Expected: Returns results (assuming default behavior is to show games if the query is empty).
3. API-3 Create New User
API Endpoint: `/users`  
Method: POST  
Description: This API creates a new user with provided details and validates user creation and conflict scenarios.

1. Create New User
   - Send a POST request to `/users` with valid user details.
   - Verify that the response status is `200` (OK).
   - Verify that the response body contains the correct email, name, nickname, and a generated UUID.

2. Email Already Exists
   - Send a POST request to `/users` with an email that already exists in the system.
   - Verify that the response status is `409` (Conflict).

3. Missing Required Fields
   - Send a POST request to `/users` with missing required fields (like email).
   - Verify that the response status is `400` (Bad Request).
4. API-4 Update a User
API Endpoint: `/users/{userId}`  
Method: PATCH  
Description: This API updates an existing user's details, ensuring conflict-free updates and successful modifications.

 1. Update Email to Existing Email
   - Send a PATCH request to `/users/{user2.uuid}` to update user2's email to user1's email.
   - Verify that the response status is `409` (Conflict) and the message indicates an email conflict.

2. Update Nickname to Existing Nickname
   - Send a PATCH request to `/users/{user2.uuid}` to update user2's nickname to user1's nickname.
   - Verify that the response status is `409` (Conflict) and the message indicates a nickname conflict.

3. Update User Details (No Conflict)
   - Send a PATCH request to `/users/{user2.uuid}` with valid user details.
   - Verify that the response status is `200` (OK) and the updated details match the request payload.

4. Update Non-Existent User
   - Send a PATCH request to `/users/{nonExistentUserId}` with valid details.
   - Verify that the response status is `400` (Bad Request).

5. Update Only Modified Fields
   - Send a PATCH request to `/users/{user1.uuid}` with only the nickname field modified.
   - Verify that the response status is `200` (OK) and only the nickname is updated in the response.
5. API-5 Add an item to user's wishlist
API Endpoint: `/users/{userUuid}/wishlist/add`  
Method: POST  
Description: This API adds a specified item to a user's wishlist. This is a duplicate of the second API but with more specific test cases.

1. Test 1: Add game to user wishlist successfully
   -  Send a request to add a game to the wishlist of the created user.
   -  Verify the game is successfully added by checking the response.

2. Test 2: Return 404 for non-existent user
   -  Attempt to add an item to the wishlist of a non-existent user.
   -  The response should return a 400 status code indicating bad request.

3. Test 3: Return 401 for unauthorized access
   -  Send a request with an invalid token to add an item to the wishlist.
   -  The response should return a 401 status code indicating unauthorized access.

4. Test 4: Return 400 when missing item_uuid in the payload
   -  Send a request without including `item_uuid` in the payload.
   -  The response should return a 500 status code indicating an internal server error.
6. API-6 List all Users
API Endpoint: `/users`  
Method: GET  
Description: This API retrieves a list of users with support for pagination through `offset` and `limit` query parameters.

1. Different Results with Changed Offset
   - Send a GET request to `/users` with `offset=0` and `limit=2`.
   - Send a second GET request to `/users` with `offset=4` and `limit=2`.
   - Verify that the status code is `200` for both requests.
   - Ensure that the users returned in both responses are different (`firstUsers` not equal to `secondUsers`).

2. Invalid Offset or Limit
   - Send a GET request to `/users` with an invalid `offset=-1` and `limit=2`.
   - Verify that the response status is `400` (Bad Request).
7. API-7 Get a user by email and password
API Endpoint: `/users/login`  
Method: POST  
Description: This API allows users to log in with their email and password, returning user details if the credentials are correct.

1. Correct Email and Password
   - Send a POST request to `/users/login` with valid `email='kate@gmail.com'` and `password='password'`.
   - Verify that the status code is `200` (OK).
   - Ensure that the response body contains the correct `email` and `name` (i.e., `kate@gmail.com` and `Kate`).

2. Incorrect Password
   - Send a POST request to `/users/login` with `email='kate@gmail.com'` and an incorrect `password='wrongpassword'`.
   - Verify that the response status is `404` (Not Found).

3. Non-Existent User Login
   - Send a POST request to `/users/login` with a non-existent email (`email='nonexistentuser@gmail.com'`) and any password.
   - Verify that the response status is `404` (Not Found).
8. API-8 Remove an item from user's wishlist
API Endpoint: `/users/{userUuid}/wishlist/remove`  
Method: POST  
Description: This API removes a specified item from a user's wishlist.  

1. Test 1: Remove game from user wishlist successfully
   -  Send a request to remove a game from the user's wishlist.
   -  Verify that the game is removed by checking the wishlist is empty after the operation.

2. Test 2: Return 404 for item not in wishlist
   -  Try removing an item that is not present in the user's wishlist.
   -  The response should return a 400 status code.

3. Test 3: Return 400 for invalid UUID format
   -  Try to remove an item with an invalid UUID format.
   -  The response should return a 400 status code.

4. Test 4: Return 401 for unauthorized access
   -  Use an invalid token and try removing the item.
   -  The response should return a 401 status code for unauthorized access.
9. API-9 Get Game by UUID
- API Endpoint: `/games/{uuid}`
- Method: `GET`
- Description: Fetches a specific game by its UUID.

1. Get game by valid UUID:
   - UUID: {valid game UUID}
   - Expected: Returns the details of the game with the given UUID.

2. Get game by non-existent UUID:
   - UUID: "non-existent-uuid"
   - Expected: Returns a 404 status code for a non-existent UUID.

3. Get game by UUID with invalid token:
   - Token: "invalid_token"
   - Expected: Returns a 401 status code for invalid authorization token.

4. Get game by invalid UUID format:
   - UUID: "123-invalid-uuid"
   - Expected: Returns a 400 status code for an invalid UUID format.
10. API-10 Get Games by Category ID
- API Endpoint: `/categories/{categoryId}/games`
- Method: `GET`
- Description: Fetches games based on a specific category ID.

1. Get games by valid category ID: 
   - Category ID: `8126d35b-5336-41ad-981d-f245c3e05665`
   - Expected: Returns games where the category ID matches the searched category ID in the response.
   - Validation: The category ID in each game should match the searched category ID.

2. Get games with invalid category ID: 
   - Category ID: `invalid-category-id`
   - Expected: Returns a 400 status code for an invalid category ID.

3. Get games with invalid authentication token:
   - Token: `invalid-token`
   - Expected: Returns a 401 status code for invalid authorization token.

4. Get games with missing required headers: 
   - Expected: Returns a 401 status code when the `Authorization` header is missing.
11. API-11 Update Avatar
- API Endpoint: `/users/{userId}/avatar`
- Method: `PUT`
- Description: Updates the user's avatar image.

1. Update avatar successfully: 
   - User ID: Created user ID from the setup.
   - Avatar File Path: `/Users/naveen/QaHacks/tests/Ishika.jpeg`
   - Validation:
     - File must exist and be a JPEG image.
     - File size should be less than or equal to 5MB.
     - Avatar URL in the response should be a valid URL, starting with `http` or `https`.
     - Response status should be 200, and the `avatar_url` should not be null.
 12. API-12 Get a Cart
- API Endpoint: `/users/{userId}/cart`
- Method: `GET`
- Description: Retrieves the current items and total price in the user's cart.

1. Add item to cart and update cart:
   - Validates adding an item, updating its quantity, and retrieving the cart.
   - The response should contain items with correct quantity and total price.

2. Add invalid item to cart:
   - Tests adding an item with an invalid `item_uuid` and expects a `400` error.

3. Add negative quantity to cart:
   - Tests adding an item with a negative quantity and expects a `400` error.

4. Try to remove an item not in the cart:
   - Tests removing an item that isn't in the cart, expecting a `400` error.

5. Add multiple different items to cart:
   - Validates adding different items and retrieving the cart, expecting multiple items in the cart.

6. Calculate total price of cart:
   - Validates the correct total price calculation when an item is added to the cart.

7. Add large quantity of item:
   - Tests adding a very large quantity (over the allowed limit) and expects a `400` error with a schema validation message.

8. Clear an already empty cart:
   - Verifies that clearing an empty cart results in an empty cart response.
13. API-13 Change an item in user's cart  
   API Endpoint: `/users/{user_uuid}/cart/change`  
   Method: POST  
   Description: This API changes the quantity of an item in the user's cart.  

1. Add game to cart, update quantity, and validate cart is not empty:  
   - Add a game to the cart with a quantity of 5.  
   - Change the quantity to 4.  
   - Validate that the cart is not empty and the quantity has been updated.

2. Error when adding an invalid item to the cart:  
   - Attempt to add an invalid game to the cart.  
   - Expect a `400` error response.

3. Error when adding a negative quantity to the cart:  
   - Attempt to add a game with a negative quantity of -5.  
   - Expect a `400` error response.

4. Error when trying to remove an item not in the cart:  
   - Attempt to remove an item that is not in the cart.  
   - Expect a `400` error response.

5. Correctly add multiple different items to the cart:  
   - Add two different items to the cart with quantities 2 and 3 respectively.  
   - Validate that both items are added to the cart.

6. Correctly calculate the total price of the cart:  
   - Add an item to the cart with quantity 2.  
   - Validate that the total price of the cart is greater than 0.

7. Handle adding a very large quantity of an item:  
   - Attempt to add an item with a quantity of 10,000.  
   - Expect a `400` error response due to the quantity being too large.

8. Return an empty cart when clearing an already empty cart:  
   - Clear the cart when it is already empty.  
   - Validate that the cart remains empty after the operation.
14. API-14 Add and Remove Games from Cart

API Endpoint: `/users/{userId}/cart`
Method: POST (for adding and removing items), GET (for viewing the cart)
Description:  
This API allows adding and removing games from a user's shopping cart. It also includes tests for handling invalid inputs, multiple items, price calculations, and clearing the cart.

1. Add and Remove Games from Cart:
   - Add two games to the cart (game1 and game2) with quantities 5 and 3, respectively.
   - Remove the first game from the cart and check that the second game remains.
   - Validate that the cart reflects the correct number of items after the removal.

2. Invalid Item Addition:
   - Attempt to add an invalid game (non-existent UUID) to the cart.
   - Expect a 400 error due to the invalid item UUID.

3. Negative Quantity Addition:
   - Attempt to add an item with a negative quantity (-5).
   - Expect a 400 error as negative quantities are not allowed.

4. Remove Item Not in Cart:
   - Attempt to remove an item not present in the cart.
   - Expect a 400 error indicating that the item cannot be removed because it doesn't exist in the cart.

5. Add Multiple Different Items to Cart:
   - Add two different games (game1 and game2) with quantities 2 and 3, respectively.
   - Check if both items are correctly added to the cart.
   - Validate that the cart contains exactly 2 items.

6. Calculate Total Cart Price:
   - Add an item (game1) with a quantity of 2 to the cart.
   - Verify that the total price of the cart is greater than 0 after adding the item.

7. Large Quantity Handling:
   - Attempt to add an item with a very large quantity (10000).
   - Expect a 400 error indicating that the quantity exceeds the allowed limit (maximum 100).

8. Clear Empty Cart:
   - Try to clear an already empty cart.
   - Verify that the cart is empty after the clear operation.
15. API-15 Clear User Cart  
   API Endpoint: `/users/{userId}/cart/clear`  
   Method: `POST`  
   Description: This endpoint allows clearing all items from the user's shopping cart.  

1. Add and Clear Cart:
   - Add an item to the cart.
   - Clear the cart and verify it returns an empty cart.
   
2. Add Invalid Item:
   - Attempt to add an invalid item to the cart and expect a `400` error.

3. Add Negative Quantity:
   - Attempt to add an item with a negative quantity and expect a `400` error.

4. Remove Non-existent Item:
   - Attempt to remove an item that is not in the cart and expect a `400` error.

5. Add Multiple Different Items:
   - Add multiple different items to the cart and verify the cart contains the correct number of items.

6. Calculate Total Price:
   - Add items to the cart and verify the total price is correctly calculated.

7. Handle Large Quantity:
   - Attempt to add a large quantity (more than allowed) of an item to the cart and expect a `400` error.

8. Clear Already Empty Cart:
   - Clear a cart that is already empty and verify it remains empty.
16. API-16 Create a New Order
 API Endpoint: 
- `/users/{userId}/orders`
 Method: 
- POST
 Description: 
- This API creates a new order for a user by specifying a list of items.
 
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
 API Endpoint: 
- `/users/{userId}/orders`
 Method: 
- GET
 Description: 
- This API lists all orders for a specific user.

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
 API Endpoint: 
- `/orders/{orderId}/status`
 Method: 
- PATCH
 Description: 
- This API updates the status of an order to a new value.

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
19. API-21 List all Users
API Endpoint: `/users`  
Method: GET  
Description: This API lists all users, including a meta field with the total number of users. It ensures that if the user list is not empty, the `meta.total` is greater than zero.

1. Meta Total Validation
   - Send a GET request to `/users?offset=0&limit=10`.
   - Verify that the response status is `200` (OK).
   - If the `users` list is not empty, ensure that `meta.total` is greater than zero.
 20. API-22 - Create User
API Endpoint: `/users`  
Method: POST  
Description: This API creates a new user with the provided email, password, name, and nickname.

1. Create User Successfully
   - Send a POST request to `/users` with the payload:
     ```json
     {
       "email": "testuser22@gmail.com",
       "password": "password123",
       "name": "Test User 22",
       "nickname": "testuser22"
     }
     ```
   - Verify that the response status code is `200`.
   - Ensure that the created user's email and name in the response match the provided values.
21. API-23 Get a User
API Endpoint: `/users/{uuid}`  
Method: GET  
Description: This API retrieves user details based on the provided user `uuid`.

1. Retrieve User Details
   - Create a user using the payload:
     ```json
     {
       "email": "ishika@gmail.com",
       "password": "ishika",  
       "name": "ishika",
       "nickname": "ishika"
     }
     ```
   - After successfully creating the user, use the returned `uuid` to send a GET request to `/users/{uuid}`.
   - Verify that the response status code is `200`.
   - Ensure the returned user details match the created user's email, name, nickname, and `uuid`.
22. API-24 User Update and Login Test
API Endpoint: `/users/{uuid}` (PATCH) and `/users/login` (POST)  
Method: PATCH for updating and POST for login  
Description: This API updates user details such as email and nickname, and then verifies that the user can log in with the updated credentials.

1. Update User Details and Login
   - First, create a user with the following payload:
     ```json
     {
       "email": "ishika@gmail.com",
       "password": "ishika",
       "name": "ishika",
       "nickname": "ishika"
     }
     ```
   - After the user is created, update their email and nickname using the following payload:
     ```json
     {
       "email": "kate_updated@gmail.com",
       "password": "password",
       "name": "ishika",
       "nickname": "kate_updated"
     }
     ```
   - Verify that the response status code for the update is `200`, and the updated email and nickname are returned.
   - Use the updated email and password (`password`) to log in with the following payload:
     ```json
     {
       "email": "kate_updated@gmail.com",
       "password": "password"
     }
     ```
   - Verify that the login response status code is `200`.

23. API-25 Add an item to user's wishlist
API Endpoint: `/users/{userUuid}/wishlist/add`  
Method: POST  
Description: This API adds a specified item to a user's wishlist.

1. Test 1: Add item to wishlist and verify
   -  Send a request to add a game to the user's wishlist.
   -  Verify that the game is added by checking the wishlist contains the added item.

2. Test 2: Return 400 for invalid UUID format
   -  Send a request to add an item using an invalid UUID.
   -  The response should return a 400 status code.

3. Test 3: Handle adding duplicate item to wishlist
   -  Add the same game item twice to the wishlist.
   -  The second addition should succeed, and the game should remain in the wishlist.

4. Test 4: Return 401 for unauthorized access
   -  Send a request with an invalid token to add an item to the wishlist.
   -  The response should return a 401 status code for unauthorized access.

5. Test 5: Return 400 when missing item_uuid in the payload
   -  Send a request with missing the `item_uuid` field in the body.
   -  The response should return a 500 status code indicating a server error.


