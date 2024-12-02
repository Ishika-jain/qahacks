2. API-2 Search Games by Query
API Endpoint: `/games/search`
Method: `GET`
Description: Searches for games based on a query string and returns matching results.
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



9. API-9 Get Game by UUID
API Endpoint: `/games/{uuid}`
Method: `GET`
Description: Fetches a specific game by its UUID.

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

