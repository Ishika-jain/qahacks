11. API-11 Update Avatar
API Endpoint: `/users/{userId}/avatar`
Method: `PUT`
Description: Updates the user's avatar image.

      1. Update avatar successfully: 
         - User ID: Created user ID from the setup.
         - Avatar File Path: `/Users/naveen/QaHacks/tests/Ishika.jpeg`
         - Validation:
         - File must exist and be a JPEG image.
         - File size should be less than or equal to 5MB.
         - Avatar URL in the response should be a valid URL, starting with `http` or `https`.
         - Response status should be 200, and the `avatar_url` should not be null.
 