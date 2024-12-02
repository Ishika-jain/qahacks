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


