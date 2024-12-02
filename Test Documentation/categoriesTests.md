10. API-10 Get Games by Category ID
API Endpoint: `/categories/{categoryId}/games`
Method: `GET`
Description: Fetches games based on a specific category ID. 

      1. Get games by valid category ID: 
         Category ID: `8126d35b-5336-41ad-981d-f245c3e05665`
         Expected: Returns games where the category ID matches the searched category ID in the response.
         Validation: The category ID in each game should match the searched category ID.
      2. Get games with invalid category ID: 
         Category ID: `invalid-category-id`
         Expected: Returns a 400 status code for an invalid category ID.
      3. Get games with invalid authentication token:
         Token: `invalid-token`
         Expected: Returns a 401 status code for invalid authorization token.
      4. Get games with missing required headers: 
         Expected: Returns a 401 status code when the `Authorization` header is missing.

