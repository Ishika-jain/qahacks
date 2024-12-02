 Refined API Issues List  



 USERS  
- API-1: Internal server error.  
- API-3: Nickname becomes empty automatically.  
- API-4: In production, updating user requires both name and email to change, whereas it works with either in other environments.  
- API-6: Offset does not work correctly; different data is not returned.  
- API-7: Search by name and password does not function.  
- API-21: Incorrect total count returned.  
- API-22: Returns a 500 error.  
- API-23: Provides incorrect user data.  
- API-24: The PATCH command removes the user's password, causing login failures after execution in the development environment.  



 WISHLIST  
- API-5: Wishlist limit is reached erroneously, even when it has not been met.  
- API-8: Items are not removed from the user's wishlist.  
- API-25: Wishlist appears empty after adding items.  



 GAMES  
- API-2: Search does not work in the development environment.  
- API-9: Unable to fetch games using game UUIDs.  



 CATEGORIES  
- API-10: Returns games from incorrect categories.  



 AVATARS  
- API-11: Avatar update claims success, but the avatar remains empty when checked.  



 CART  
- API-12: Total price is 0 in development, even after adding items.  
- API-13: Items list is empty despite adding items to the cart.  
- API-14: Removing one item inadvertently removes all items.  
- API-15: Clearing the user cart does not remove cart contents.  



 ORDERS  
- API-16: Accepts duplicate items (same `item_uuid`) in development, while release correctly throws a 400 error with the message:  
  ```json
  {
      "code": 400,
      "message": "Items with the following \"uuid\" are duplicated: <uuid>"
  }
  ```  
- API-17: Limit parameter does not work.  
- API-18: Cannot update order status to "Cancelled."  



 PAYMENTS  
- API-19: `created_at` and `updated_at` values are missing in development but present in release.  
- API-20: Undefined issue (requires elaboration).  