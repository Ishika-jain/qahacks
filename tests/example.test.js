const request = require('supertest');

const BASE_URL = 'https://release-gs.qa-playground.com/api/v1'; 

// describe('DELETE /users/:id API Test', () => {
//     test('API - 1 : should delete the user and return the expected response', async () => {
//         const userId = 'c7beaf51-5b47-43d0-9b39-14f200a0a180';
//         const taskId = 'api-1';
//         const token = 'qahack2024:ishika2413@gmail.com';
    
//         const response = await request(BASE_URL)
//             .delete(`/users/${userId}`)
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId);
//             expect(response.statusCode).toBe(204);
//             expect(response.body).toEqual({});
//             console.log('Response Status:', response.statusCode);
//             console.log('Response Body:', response.body);
//     });
// });

// describe('POST /users API Test', () => {
//     test('should create a user and return correct details including nickname', async () => {
//         const taskId = 'api-3';
//         const token = 'qahack2024:ishika2413@gmail.com';

//         const payload = {
//             email: "sampleuser5@gmail.com",
//             password: "sampleuser5",
//             name: "sampleuser5",
//             nickname: "sample5",
//         };

//         const response = await request(BASE_URL)
//             .post('/users')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId)
//             .set('Content-Type', 'application/json')
//             .send(payload);

//         console.log('Response Status:', response.statusCode);
//         console.log('Response Body:', response.body);
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toMatchObject({
//             email: payload.email,
//             name: payload.name,
//             nickname: payload.nickname, 
//         });
//         expect(response.body.uuid).toEqual(expect.any(String));
//         expect(response.body.avatar_url).toBe("");
//     });
// });



// describe('PATCH /users/:id API Test', () => {
//     let user1, user2;
//     const token = 'qahack2024:ishika2413@gmail.com';
//     const taskId = 'api-4';

//     beforeAll(async () => {
//         // Run the cleanup API
//         await request(BASE_URL)
//             .post('/setup')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .send();
        
//         // Create User 1
//         const user1Payload = {
//             email: "ishika@gmail.com",
//             password: "ishikasPass",
//             name: "ishika",
//             nickname: "ishi",
//         };
//         const user1Response = await request(BASE_URL)
//             .post('/users')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('Content-Type', 'application/json')
//             .set('X-Task-Id', taskId)
//             .send(user1Payload);
//         user1 = user1Response.body;

//         // Create User 2
//         const user2Payload = {
//             email: "dhruv@gmail.com",
//             password: "dhruvsPass",
//             name: "dhruv",
//             nickname: "dhruvi",
//         };
//         const user2Response = await request(BASE_URL)
//             .post('/users')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('Content-Type', 'application/json')
//             .set('X-Task-Id', taskId)
//             .send(user2Payload);
//         user2 = user2Response.body;
//     }, 10000);

//     test('should not allow updating email to an existing email', async () => {
//         const updatePayload = {
//             email: user1.email, // Duplicate email
//             name: "Ishika",
//             nickname: "ishika2025", // Unique nickname
//         };

//         const response = await request(BASE_URL)
//             .patch(`/users/${user2.uuid}`)
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId)
//             .set('Content-Type', 'application/json')
//             .send(updatePayload);

//         console.log('Response Status:', response.statusCode);
//         console.log('Response Body:', response.body);

//         expect(response.statusCode).toBe(409);
//         expect(response.body).toMatchObject({
//             code: 409,
//             message: `User with the following "email" already exists: ${user1.email}`,
//         });
//     });

//     test('should not allow updating nickname to an existing nickname', async () => {
//         console.log(user1)
//         const updatePayload = {
//             email: "ishika2024@gmail.com", // Unique email
//             name: "Ishika",
//             nickname: user1.nickname, // Duplicate nickname
//         };

//         const response = await request(BASE_URL)
//             .patch(`/users/${user2.uuid}`)
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId)
//             .set('Content-Type', 'application/json')
//             .send(updatePayload);

//         expect(response.statusCode).toBe(409);
//         expect(response.body).toMatchObject({
//             code: 409,
//             message: `User with the following "nickname" already exists: ${user1.nickname}`,
//         });
//         console.log(response.statusCode, response.body)
//     });

//     test('should successfully update user details if no conflict', async () => {
//         const updatePayload = {
//             email: "ishika2025@gmail.com", // Unique email
//             name: "Ishika",
//             nickname: "ishika2025", // Unique nickname
//         };

//         const response = await request(BASE_URL)
//             .patch(`/users/${user2.uuid}`)
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId)
//             .set('Content-Type', 'application/json')
//             .send(updatePayload);

//         expect(response.statusCode).toBe(200);
//         expect(response.body).toMatchObject({
//             email: updatePayload.email,
//             name: updatePayload.name,
//             nickname: updatePayload.nickname,
//             avatar_url: "", // Assuming avatar_url remains empty
//             uuid: user2.uuid, // UUID should remain the same
//         });
//     });
// });

// describe('GET /users API Test', () => {
//     const token = 'qahack2024:ishika2413@gmail.com';
//     const taskId = 'api-21';

//     test('should validate that if users list is not empty, meta.total is also not zero', async () => {
//         const response = await request(BASE_URL)
//             .get('/users?offset=0&limit=10')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId);

//         const responseBody = response.body;

//         // Log response body for debugging
//         console.log('Response Body:', responseBody);

//         // Validate response
//         expect(response.statusCode).toBe(200);

//         if (responseBody.users.length > 0) {
//             expect(responseBody.meta.total).not.toBe(0); // If users list is not empty, total should not be zero
//         }
//     });
// });

// describe('POST /users/login API Test', () => {
//     const token = 'qahack2024:ishika2413@gmail.com';
//     const taskId = 'api-7';
//     let newUser;

//     beforeAll(async () => {
//         // Run setup to clean up any previous state
//         await request(BASE_URL)
//             .post('/setup')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .send();

//         // Create a new user
//         const userPayload = {
//             email: "kate123@gmail.com",
//             password: "password",  // Ensure this is the correct password
//             name: "Kate",
//             nickname: "kate123",
//         };

//         const userResponse = await request(BASE_URL)
//             .post('/users')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('Content-Type', 'application/json')
//             .set('X-Task-Id', taskId)
//             .send(userPayload);

//         // Ensure the user was created successfully
//         expect(userResponse.statusCode).toBe(200);
//         expect(userResponse.body).toHaveProperty('uuid'); // Check if UUID is present

//         newUser = userResponse.body;
//     });

//     test('should log in with valid credentials and return user details', async () => {
//         const loginPayload = {
//             email: newUser.email,
//             password: "password",  // Use the correct password set during user creation
//         };

//         const response = await request(BASE_URL)
//             .post('/users/login')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId)
//             .set('Content-Type', 'application/json')
//             .send(loginPayload);

//         const responseBody = response.body;

//         // Log the response for debugging
//         console.log('Login Response:', responseBody);

//         // Validate the response
//         expect(response.statusCode).toBe(200);
//         expect(responseBody).toMatchObject({
//             avatar_url: "",
//             email: newUser.email,
//             name: newUser.name,
//             nickname: newUser.nickname,
//             uuid: newUser.uuid,
//         });
//     });
// });



// describe('GET /users API Test with Offset and Limit', () => {
//     const token = 'qahack2024:ishika2413@gmail.com';
//     const taskId = 'api-6';
//     let firstResponse, secondResponse;

//     beforeAll(async () => {
//         // Run setup to clean up any previous state
//         await request(BASE_URL)
//             .post('/setup')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .send();
//     });

//     test('should return different results when offset is changed', async () => {
//         // First API call with offset=0 and limit=2
//         firstResponse = await request(BASE_URL)
//             .get('/users')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId)
//             .query({ offset: 0, limit: 2 });

//         expect(firstResponse.statusCode).toBe(200);
//         console.log('First Response:', firstResponse.body);

//         // Second API call with offset=2 and limit=2
//         secondResponse = await request(BASE_URL)
//             .get('/users')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId)
//             .query({ offset: 2, limit: 2 });

//         expect(secondResponse.statusCode).toBe(200);
//         console.log('Second Response:', secondResponse.body);

//         // Ensure the results are different by comparing the unique user IDs
//         const firstUsers = firstResponse.body.users;
//         const secondUsers = secondResponse.body.users;

//         // Check that at least one user in the first response is different from the second response
//         let differentResults = false;
//         for (let user1 of firstUsers) {
//             for (let user2 of secondUsers) {
//                 if (user1.uuid !== user2.uuid) {
//                     differentResults = true;
//                     break;
//                 }
//             }
//             if (differentResults) break;
//         }

//         expect(differentResults).toBe(true); // Ensure the results are different
//     });
// });


// describe('GET /users/:uuid API Test for Created User', () => {
//     const token = 'qahack2024:ishika2413@gmail.com';
//     const taskId = 'api-7';
//     let createdUser;

//     beforeAll(async () => {
//         // Run setup to clean up any previous state
//         await request(BASE_URL)
//             .post('/setup')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .send();

//         // Create a new user
//         const userPayload = {
//             email: 'newuser@gmail.com',
//             password: 'password123',
//             name: 'New User',
//             nickname: 'newuser'
//         };
//         const response = await request(BASE_URL)
//             .post('/users')
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId)
//             .set('Content-Type', 'application/json')
//             .send(userPayload);
        
//         createdUser = response.body; // Capture the created user details
//         expect(response.statusCode).toBe(200); // Ensure user creation is successful
//     });

//     test('should return same user details when getting by uuid', async () => {
//         const uuid = createdUser.uuid;

//         // Call the GET /users/:uuid API
//         const response = await request(BASE_URL)
//             .get(`/users/${uuid}`)
//             .set('accept', 'application/json')
//             .set('Authorization', `Bearer ${token}`)
//             .set('X-Task-Id', taskId);

//         expect(response.statusCode).toBe(200);
        
//         // Check that the returned user details match the created user
//         expect(response.body.uuid).toBe(createdUser.uuid);
//         expect(response.body.email).toBe(createdUser.email);
//         expect(response.body.name).toBe(createdUser.name);
//         expect(response.body.nickname).toBe(createdUser.nickname);
//         expect(response.body.avatar_url).toBe(createdUser.avatar_url); // Optionally, if avatar_url is part of the response
//     });
// });


