const request = require('supertest');
const path = require('path');
const fs = require('fs');  

const BASE_URL = 'https://release-gs.qa-playground.com/api/v1';

describe('API-1 Delete Users', () => {
    let createdUserId;  
    const taskId = 'api-1';
    const token = 'qahack2024:ishika2413@gmail.com';

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

        const userPayload = {
            email: 'deleteuser@gmail.com',
            password: 'password123',
            name: 'Delete User',
            nickname: 'deleteuser'
        };

        const createUserResponse = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload);

        createdUserId = createUserResponse.body.uuid;
        expect(createUserResponse.statusCode).toBe(200);  
    }, 10000);

    test('API - 1 : should delete the user and return the expected response', async () => {
        const deleteResponse = await request(BASE_URL)
            .delete(`/users/${createdUserId}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        expect(deleteResponse.statusCode).toBe(204);
        expect(deleteResponse.body).toEqual({}); 
        const fetchUserResponse = await request(BASE_URL)
            .get(`/users/${createdUserId}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        expect(fetchUserResponse.statusCode).toBe(404);  
    });

    test('should return 400 if trying to delete a non-existent user', async () => {
        const nonExistentUserId = 'non-existent-id';
        const deleteResponse = await request(BASE_URL)
            .delete(`/users/${nonExistentUserId}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
    
        expect(deleteResponse.statusCode).toBe(400);
    });

    test('should return 401 when unauthorized', async () => {
        const deleteResponse = await request(BASE_URL)
            .delete(`/users/${createdUserId}`)
            .set('accept', 'application/json')
            .set('Authorization', 'Bearer invalid-token')
            .set('X-Task-Id', taskId);
    
        expect(deleteResponse.statusCode).toBe(401);
    });
    
});

describe('API-3 Create New User', () => {
    const taskId = 'api-3';
    const token = 'qahack2024:ishika2413@gmail.com';

    test('should create a user and return correct details including nickname', async () => {
        const taskId = 'api-3';
        const token = 'qahack2024:ishika2413@gmail.com';

        const payload = {
            email: "sampleuser5@gmail.com",
            password: "sampleuser5",
            name: "sampleuser5",
            nickname: "sample5",
        };

        const response = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            email: payload.email,
            name: payload.name,
            nickname: payload.nickname, 
        });
        expect(response.body.uuid).toEqual(expect.any(String));
        expect(response.body.avatar_url).toBe("");
    });

    test('should return 409 when email already exists', async () => {
        const payload = {
            email: "sampleuser5@gmail.com", 
            password: "sampleuser5",
            name: "sampleuser5",
            nickname: "sample5",
        };
    
        const response = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);
    
        expect(response.statusCode).toBe(409);
    });
    
    test('should return 400 for missing required fields', async () => {
        const payload = { name: "missingemail" };   
        const response = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);
    
        expect(response.statusCode).toBe(400);
    });
    
});

describe('API-4 Update a User', () => {
    let user1, user2;
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-4';

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();
        
        const user1Payload = {
            email: "ishika@gmail.com",
            password: "ishikasPass",
            name: "ishika",
            nickname: "ishi",
        };
        const user1Response = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .set('X-Task-Id', taskId)
            .send(user1Payload);
        user1 = user1Response.body;

        const user2Payload = {
            email: "dhruv@gmail.com",
            password: "dhruvsPass",
            name: "dhruv",
            nickname: "dhruvi",
        };
        const user2Response = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .set('X-Task-Id', taskId)
            .send(user2Payload);
        user2 = user2Response.body;
    }, 10000);

    test('should not allow updating email to an existing email', async () => {
        const updatePayload = {
            email: user1.email, 
            name: "dhruv",
            nickname: "dhruvi", 
        };

        const response = await request(BASE_URL)
            .patch(`/users/${user2.uuid}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(updatePayload);
        expect(response.statusCode).toBe(409);
        expect(response.body).toMatchObject({
            code: 409,
            message: `User with the following "email" already exists: ${user1.email}`,
        });
    });

    test('should not allow updating nickname to an existing nickname', async () => {
        const updatePayload = {
            email: "dhruv@gmail.com",  
            name: "dhruv",
            nickname: user1.nickname, 
        };

        const response = await request(BASE_URL)
            .patch(`/users/${user2.uuid}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(updatePayload);

        expect(response.statusCode).toBe(409);
        expect(response.body).toMatchObject({
            code: 409,
            message: `User with the following "nickname" already exists: ${user1.nickname}`,
        });
    });

    test('should successfully update user details if no conflict', async () => {
        const updatePayload = {
            email: "ishika2025@gmail.com", 
            name: "Ishika",
            nickname: "ishika2025", 
        };

        const response = await request(BASE_URL)
            .patch(`/users/${user2.uuid}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(updatePayload);

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject({
            email: updatePayload.email,
            name: updatePayload.name,
            nickname: updatePayload.nickname,
            avatar_url: "", 
            uuid: user2.uuid, 
        });
    });

    test('should return 400 if user does not exist for update', async () => {
        const updatePayload = {
            email: "newemail@gmail.com",
            name: "New Name",
            nickname: "newnick",
        };
    
        const response = await request(BASE_URL)
            .patch('/users/nonexistent-uuid')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(updatePayload);
    
        expect(response.statusCode).toBe(400);
    });

    test('should update only the modified fields', async () => {
        const updatePayload = {
            nickname: "newnickname",  
        };
    
        const response = await request(BASE_URL)
            .patch(`/users/${user1.uuid}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(updatePayload);
    
        expect(response.statusCode).toBe(200);
        expect(response.body.nickname).toBe(updatePayload.nickname);
    });
    
});

describe('API-6 List all Users', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-6';
    let firstResponse, secondResponse;

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

        const userPayload = {
            email: 'ishika@gmail.com',
            password: 'ishika',
            name: 'ishika',
            nickname: 'ishika'
        };

        await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload);
    },10000);

    test('should return different results when offset is changed', async () => {
        firstResponse = await request(BASE_URL)
            .get('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .query({ offset: 0, limit: 2 });

        expect(firstResponse.statusCode).toBe(200);

        secondResponse = await request(BASE_URL)
            .get('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .query({ offset: 4, limit: 2 });

        expect(secondResponse.statusCode).toBe(200);
        const firstUsers = firstResponse.body.users;
        const secondUsers = secondResponse.body.users;
        

        expect(firstUsers).not.toBe(secondUsers); 
        expect(firstUsers).not.toEqual(secondUsers); 
    });
    
    test('should return 400 for invalid offset or limit', async () => {
                const response = await request(BASE_URL)
                    .get('/users')
                    .set('accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`)
                    .set('X-Task-Id', taskId)
                    .query({ offset: -1, limit: 2 });
            
                expect(response.statusCode).toBe(400);
    });   
            
});

describe('API-7 Get a user by email and password', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-7';
    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();
    }, 10000);

    test('should return same user details', async () => {
        const userPayload = {
            email: 'kate@gmail.com',
            password: 'password',
        };

        const response = await request(BASE_URL)
            .post(`/users/login`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload)
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe('kate@gmail.com');
        expect(response.body.name).toBe('Kate');

        
    });

    test('should return 401 with incorrect password', async () => {
        const userPayload = {
            email: 'kate@gmail.com',
            password: 'wrongpassword',
        };
    
        const response = await request(BASE_URL)
            .post(`/users/login`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload);
    
        expect(response.statusCode).toBe(404);
    });

    test('should return 404 for non-existent user login', async () => {
        const userPayload = {
            email: 'nonexistentuser@gmail.com',
            password: 'password',
        };
    
        const response = await request(BASE_URL)
            .post(`/users/login`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload);
    
        expect(response.statusCode).toBe(404);
    });
    
    
});

describe('API-21 List all Users', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-21';

    test('should validate that if users list is not empty, meta.total is also not zero', async () => {
        const response = await request(BASE_URL)
            .get('/users?offset=0&limit=10')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        const responseBody = response.body;

       
        expect(response.statusCode).toBe(200);

        if (responseBody.users.length > 0) {
            expect(responseBody.meta.total).not.toBe(0); 
        }
    });
});

describe('API-22 - Create User', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-22';
    beforeAll(async () => {
            await request(BASE_URL)
                .post('/setup')
                .set('accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();
    }, 5000);
    test('should create a user and not return 500 error', async () => {
       
    const userPayload = {
        email: 'testuser22@gmail.com',
        password: 'password123',
        name: 'Test User 22',
        nickname: 'testuser22'
    };

    createUserResponse = await request(BASE_URL)
        .post('/users')
        .set('accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Task-Id', taskId)
        .set('Content-Type', 'application/json')
        .send(userPayload);
        expect(createUserResponse.statusCode).toBe(200);
        expect(createUserResponse.body.email).toBe(userPayload.email);
        expect(createUserResponse.body.name).toBe(userPayload.name);
    });
});

describe('API-23 Get a User', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-23';
    let newUser;

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

        const userPayload = {
            email: "ishika@gmail.com",
            password: "ishika",  
            name: "ishika",
            nickname: "ishika",
        };

        const userResponse = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json')
            .set('X-Task-Id', taskId)
            .send(userPayload);

        expect(userResponse.statusCode).toBe(200);
        expect(userResponse.body).toHaveProperty('uuid'); 

        newUser = userResponse.body;
    }, 10000);

    test('should log in with valid credentials and return user details', async () => {
        const response = await request(BASE_URL)
            .get(`/users/${newUser.uuid}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')

        const responseBody = response.body;
        expect(response.statusCode).toBe(200);
        expect(responseBody).toMatchObject({
            avatar_url: "",
            email: newUser.email,
            name: newUser.name,
            nickname: newUser.nickname,
            uuid: newUser.uuid,
        });
    });
});

describe('API-24 User Update and Login Test', () => {
    const token = 'qahack2024:ishika2413@gmail.com'; 
    const taskId = 'api-24'; 
    
    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();
    }, 5000);

    test('should update user email and nickname and login with updated credentials', async () => {   
        const userPayload = {
            email: 'ishika@gmail.com',
            password: 'ishika',
            name: 'ishika',
            nickname: 'ishika',
        };

        const createUserResponse = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload);

        createdUser = createUserResponse.body; 
        expect(createUserResponse.statusCode).toBe(200);

        const updatedUserPayload = {
            email: 'kate_updated@gmail.com',
            password: 'password',
            name: createdUser.name,
            nickname: 'kate_updated',
        };
        const updateUserResponse = await request(BASE_URL)
            .patch(`/users/${createdUser.uuid}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(updatedUserPayload);
     expect(updateUserResponse.statusCode).toBe(200);
        expect(updateUserResponse.body.email).toBe(updatedUserPayload.email);
        expect(updateUserResponse.body.nickname).toBe(updatedUserPayload.nickname);

        const loginPayload = {
            email: updatedUserPayload.email,
            password: 'password',
        };

        const loginResponse = await request(BASE_URL)
            .post('/users/login')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(loginPayload);

        expect(loginResponse.statusCode).toBe(200);
    
    });
})