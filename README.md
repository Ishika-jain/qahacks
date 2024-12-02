API Testing Documentation

This document outlines the test cases for API functionality, using Jest as the testing framework and Supertest for making HTTP requests. The tests ensure that the API behaves as expected, following the defined specifications and validating the correctness of different operations.

You can find the bugs list at [Link Text](/Test%20Documentation/ErrorList.md)
For Setup Instructions Go to [Link Text](/Test%20Documentation/Setup.md)

 Testing Setup:
- BASE_URL: The API server’s base URL, used to make requests in the test cases.
- Authorization Token: A bearer token for authentication, ensuring the requests are authorized to access protected endpoints.
- Supertest: A package used for making HTTP requests and verifying the responses from the API, allowing assertions to be made on the status code, response body, headers, and more.

 Test Structure:
1. Test Initialization: Test cases may include setup functions (like `beforeAll` or `beforeEach`) to initialize data, create users, or set up conditions required for testing.
2. Test Assertions: Each test case includes assertions using Jest's `expect` function to verify the response's correctness (e.g., checking if the status code is as expected or if the response body matches the criteria).
3. Error Handling: Tests also cover edge cases, such as invalid input or unexpected responses, ensuring the API returns appropriate error codes (e.g., `400` for bad requests).

Find test case description for all categories here 

For User Test Case Documentation Go to [Link Text](/Test%20Documentation/userTests.md)
For Wishlist Test Case Documentation Go to [Link Text](/Test%20Documentation/wishlistTests.md)
For Cart Test Case Documentation Go to [Link Text](/Test%20Documentation/cartTests.md)
For Games Test Case Documentation Go to [Link Text](/Test%20Documentation/gamesTests.md)
For Category Test Case Documentation Go to [Link Text](/Test%20Documentation/categoriesTests.md)
For Order Test Case Documentation Go to [Link Text](/Test%20Documentation/orderTests.md)
For Avatar Test Case Documentation Go to [Link Text](/Test%20Documentation/avatarTests.md)

