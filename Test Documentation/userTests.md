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


