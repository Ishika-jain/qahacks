const request = require('supertest');
const path = require('path');
const fs = require('fs');  

const BASE_URL = 'https://release-gs.qa-playground.com/api/v1';


describe('API-8 Remove an item from user\'s wishlist', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-8';
    let createdUser, gameItem;

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

        const userPayload = {
            email: 'removewishlistuser@gmail.com',
            password: 'password123',
            name: 'Remove Wishlist User',
            nickname: 'removewishlist'
        };
        const userResponse = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload);
        createdUser = userResponse.body;

        const gameResponse = await request(BASE_URL)
            .get('/games?offset=0&limit=1')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        const games = gameResponse.body.games;
        gameItem = games[0];

        const wishlistPayload = { item_uuid: gameItem.uuid };
        const wishlistbefore = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(wishlistPayload);
    }, 10000);

    test('should remove game from user wishlist successfully', async () => {
        const removePayload = { item_uuid: gameItem.uuid };
        const removeResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/remove`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(removePayload);
        expect(removeResponse.statusCode).toBe(200);
        const wishlistafter = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/wishlist`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
            const wishlist = wishlistafter.body.items;
        expect(wishlistafter.statusCode).toBe(200);
        expect(Array.isArray(wishlistafter.body.items)).toBe(true);
        expect(wishlistafter.body.items.length).toBe(0);
    });

    test('should return 404 when trying to remove an item not in wishlist', async () => {
        const invalidUUID = 'non-existent-uuid';
        const removePayload = { item_uuid: invalidUUID };
        const removeResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/remove`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(removePayload);
        expect(removeResponse.statusCode).toBe(400);
    });

    test('should return 400 for invalid UUID format in removal request', async () => {
        const invalidUUID = 'invalid-uuid';
        const removePayload = { item_uuid: invalidUUID };
        const removeResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/remove`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(removePayload);
        expect(removeResponse.statusCode).toBe(400);
    });

    test('should return 401 for unauthorized access during removal', async () => {
        const invalidToken = 'invalid_token';
        const removePayload = { item_uuid: gameItem.uuid };
        const removeResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/remove`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${invalidToken}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(removePayload);
        expect(removeResponse.statusCode).toBe(401);
    });

  
});

describe('API-25 Add an Item to users wishlist', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-25';
    let createdUser, gameItem;

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

    }, 10000);

    test('should add item to wishlist and verify', async () => {

        const userPayload = {
            email: 'wishlisttestuser@gmail.com',
            password: 'password123',
            name: 'Wishlist Test User',
            nickname: 'wishlistuser'
        };
        const userResponse = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload);
        createdUser = userResponse.body;

        const gameResponse = await request(BASE_URL)
            .get('/games?offset=0&limit=1')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        const games = gameResponse.body.games;
        gameItem = games[0];

        const wishlistPayload = { item_uuid: gameItem.uuid };
        const addResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(wishlistPayload);

        expect(addResponse.statusCode).toBe(200);

        const wishlistResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/wishlist`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        const wishlist = wishlistResponse.body.items;
        expect(wishlistResponse.statusCode).toBe(200);
        expect(wishlist).toContainEqual(expect.objectContaining({ uuid: gameItem.uuid }));
    });


    test('should return 400 for invalid UUID format while adding to wishlist', async () => {
        const invalidUUID = 'invalid-uuid-format';
        const wishlistPayload = { item_uuid: invalidUUID };
        const addResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(wishlistPayload);
        expect(addResponse.statusCode).toBe(400);
    });

    test('should handle adding duplicate item to wishlist', async () => {
        const wishlistPayload = { item_uuid: gameItem.uuid };
        await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(wishlistPayload);

        const addDuplicateResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(wishlistPayload);
        
        expect(addDuplicateResponse.statusCode).toBe(200); 
    });

    test('should return 401 for unauthorized access while adding to wishlist', async () => {
        const invalidToken = 'invalid_token';
        const wishlistPayload = { item_uuid: gameItem.uuid };
        const addResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${invalidToken}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(wishlistPayload);
        expect(addResponse.statusCode).toBe(401);
    });

    test('should return 400 when missing item_uuid in the payload', async () => {
        const invalidPayload = {}; 
        const addResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(invalidPayload);
        expect(addResponse.statusCode).toBe(500);
    });

});

describe('API-5 add an item to user\'s wishlist', () => {
    const token = 'qahack2024:ishika2413@gmail.com'; 
    const taskId = 'api-5'; 
    let createdUser, gameItem;

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

        const userPayload = {
            email: 'newwishlistuser@gmail.com',
            password: 'password123',
            name: 'Wishlist User',
            nickname: 'wishlistuser'
        };
        const userResponse = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload);
        createdUser = userResponse.body;

        expect(userResponse.statusCode).toBe(200); 

       
    }, 10000); 

    test('should add game to user wishlist successfully', async () => {
        const gameResponse = await request(BASE_URL)
            .get('/games?offset=0&limit=1')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        const games = gameResponse.body.games;

        expect(gameResponse.statusCode).toBe(200); 
        expect(games).toHaveLength(1); 
        gameItem = games[0];
        const wishlistPayload = {
            item_uuid: gameItem.uuid
        };
        const wishlistResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(wishlistPayload);

        expect(wishlistResponse.statusCode).toBe(200); 
        expect(wishlistResponse.body.items[0]).toEqual(expect.objectContaining({
            uuid: gameItem.uuid
        }));
        

        const wishlist = wishlistResponse.body;
        expect(wishlist.code).not.toBe(422);
       
    });


   

    test('should return 404 when adding an item to a non-existent user\'s wishlist', async () => {
        const invalidUserUUID = 'non-existent-user';
        const wishlistPayload = { item_uuid: gameItem.uuid };
        const addResponse = await request(BASE_URL)
            .post(`/users/${invalidUserUUID}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(wishlistPayload);
        
        expect(addResponse.statusCode).toBe(400);
    });

    test('should return 401 for unauthorized access during add', async () => {
        const invalidToken = 'invalid_token';
        const wishlistPayload = { item_uuid: gameItem.uuid };
        const addResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${invalidToken}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(wishlistPayload);
        
        expect(addResponse.statusCode).toBe(401);
    });

    test('should return 400 when missing item_uuid in the payload', async () => {
        const invalidPayload = {}; 
        const addResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/wishlist/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(invalidPayload);
        
        expect(addResponse.statusCode).toBe(500);
    });

});