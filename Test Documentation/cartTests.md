12. API-12 Get a Cart
API Endpoint: `/users/{userId}/cart`
Method: `GET`
Description: Retrieves the current items and total price in the user's cart.

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


