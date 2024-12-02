const request = require('supertest');
const path = require('path');
const fs = require('fs');  

const BASE_URL = 'https://release-gs.qa-playground.com/api/v1';


describe('API-12 Get a Cart', () => {
    let createdUser;
    let gameId,gameId2;
    const taskId = 'api-12';
    const token = 'qahack2024:ishika2413@gmail.com';

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

        const userPayload = {
            email: 'testuser@gmail.com',
            password: 'password123',
            name: 'Test User',
            nickname: 'testuser'
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

        const gameResponse = await request(BASE_URL)
            .get('/games?offset=0&limit=10')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        gameId = gameResponse.body.games[0].uuid;
        gameId2 = gameResponse.body.games[1].uuid; 
    }, 15000); 

    test('should add item to cart and update cart', async () => {
        const addItemResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId, 
                quantity: 5
            });
        
        expect(addItemResponse.statusCode).toBe(200);

        const updateItemResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/change`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId, 
                quantity: 4 
            });

        expect(updateItemResponse.statusCode).toBe(200); 

        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.body.items.length).toBeGreaterThan(0); 
        expect(cartResponse.body.total_price).toBeGreaterThan(0); 
        expect(cartResponse.body.user_uuid).toBe(createdUser.uuid); 
    });

    test('should return an error when adding an invalid item to the cart', async () => {
        const invalidGameId = 'invalid-game-uuid';
        
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: invalidGameId,
                quantity: 5
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should return an error when adding a negative quantity to the cart', async () => {
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: -5
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should return an error when trying to remove an item not in the cart', async () => {
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/remove`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: 'non-existing-item-uuid'
            });
    
        expect(response.statusCode).toBe(400);  
    });
    
    test('should correctly add multiple different items to the cart', async () => {
        
        const firstAddResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 2
            });
        expect(firstAddResponse.statusCode).toBe(200);
    
        const secondAddResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId2,
                quantity: 3
            });
        expect(secondAddResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.items.length).toBe(2); 
    });
    
    test('should correctly calculate the total price of the cart', async () => {
        const addItemResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 2
            });
    
        expect(addItemResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.total_price).toBeGreaterThan(0); 
    });
    
    test('should handle adding a very large quantity of an item', async () => {
        const largeQuantity = 10000;
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: largeQuantity
            });
    
        expect(response.statusCode).toBe(400); 
        expect(response.body).toMatchObject({
            code: 400,
            message: 'request body has an error: doesn\'t match schema #/components/schemas/NewCartItem: Error at \"/quantity\": number must be at most 100',
        }); 
    });
    
    test('should return an empty cart when clearing an already empty cart', async () => {
        const clearCartResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/clear`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .send();
        
        expect(clearCartResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.items).toEqual([]);  
    });
    

});

describe('API-13 Change an item in user\'s cart', () => {
    let createdUser;
    let gameId, gameId2;
        const taskId = 'api-13';
        const token = 'qahack2024:ishika2413@gmail.com';
    beforeAll(async () => {

        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

        const userPayload = {
            email: 'testuser2@gmail.com',
            password: 'password123',
            name: 'Test User 2',
            nickname: 'testuser2'
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

        const gameResponse = await request(BASE_URL)
            .get('/games?offset=0&limit=10')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        gameId = gameResponse.body.games[0].uuid; 
        gameId2 = gameResponse.body.games[1].uuid
        expect(gameResponse.statusCode).toBe(200); 
        expect(gameId).toBeDefined(); 
    }, 15000); 

    test('Add game to cart, update quantity, and validate cart is not empty', async () => {
        const addItemResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 5
            });

        expect(addItemResponse.statusCode).toBe(200); 

        const changeItemResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/change`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 4 
            });

        expect(changeItemResponse.statusCode).toBe(200); 
        expect(changeItemResponse.body.items).not.toEqual([]);
    });

    test('should return an error when adding an invalid item to the cart', async () => {
        const invalidGameId = 'invalid-game-uuid';
        
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: invalidGameId,
                quantity: 5
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should return an error when adding a negative quantity to the cart', async () => {
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: -5
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should return an error when trying to remove an item not in the cart', async () => {
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/remove`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: 'non-existing-item-uuid'
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should correctly add multiple different items to the cart', async () => {
        
        const firstAddResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 2
            });
        expect(firstAddResponse.statusCode).toBe(200);
    
        const secondAddResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId2,
                quantity: 3
            });
        expect(secondAddResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.items.length).toBe(2); 
    });
    
    test('should correctly calculate the total price of the cart', async () => {
        const addItemResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 2
            });
    
        expect(addItemResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.total_price).toBeGreaterThan(0); 
    });
    
    test('should handle adding a very large quantity of an item', async () => {
        const largeQuantity = 10000;
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: largeQuantity
            });
    
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject({
            code: 400,
            message: 'request body has an error: doesn\'t match schema #/components/schemas/NewCartItem: Error at \"/quantity\": number must be at most 100',
        });  
      });
    
    test('should return an empty cart when clearing an already empty cart', async () => {
        const clearCartResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/clear`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .send();
        
        expect(clearCartResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.items).toEqual([]); 
    });
    
});

describe('API-14: Add and Remove Games from Cart', () => {
    let userId;
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-14';
    const gameId = '12dc6bb3-cd3f-412a-86fe-3c1dce867481';
    const gameId2 = '1990ecdd-4d3d-4de2-91b9-d45d794c82bc';

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('Authorization', `Bearer ${token}`)
            .set('accept', 'application/json')
            .send();

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
        userId = createUserResponse.body.uuid;    
        }, 5000);

    test('should add two games to the cart, remove the first, and validate the second remains', async () => {
        const firstGameId = '12dc6bb3-cd3f-412a-86fe-3c1dce867481';
        const secondGameId = '1990ecdd-4d3d-4de2-91b9-d45d794c82bc';
    
        const addFirstGameResponse = await request(BASE_URL)
            .post(`/users/${userId}/cart/add`)
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('accept', 'application/json')
            .send({
                item_uuid: firstGameId,
                quantity: 5,
            });

        expect(addFirstGameResponse.statusCode).toBe(200);

        const addSecondGameResponse = await request(BASE_URL)
            .post(`/users/${userId}/cart/add`)
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('accept', 'application/json')
            .send({
                item_uuid: secondGameId,
                quantity: 3,
            });

        expect(addSecondGameResponse.statusCode).toBe(200);

        const removeFirstGameResponse = await request(BASE_URL)
            .post(`/users/${userId}/cart/remove`)
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('accept', 'application/json')
            .send({
                item_uuid: firstGameId,
            });

        expect(removeFirstGameResponse.statusCode).toBe(200);
        expect(removeFirstGameResponse.body.items.length).toBe(1);
    });

    test('should return an error when adding an invalid item to the cart', async () => {
        const invalidGameId = 'invalid-game-uuid';
        
        const response = await request(BASE_URL)
            .post(`/users/${userId}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: invalidGameId,
                quantity: 5
            });
    
        expect(response.statusCode).toBe(400); 
    });

    
    test('should return an error when adding a negative quantity to the cart', async () => {
        const response = await request(BASE_URL)
            .post(`/users/${userId}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: -5
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should return an error when trying to remove an item not in the cart', async () => {
        const response = await request(BASE_URL)
            .post(`/users/${userId}/cart/remove`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: 'non-existing-item-uuid'
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should correctly add multiple different items to the cart', async () => {
        
        const firstAddResponse = await request(BASE_URL)
            .post(`/users/${userId}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 2
            });
        expect(firstAddResponse.statusCode).toBe(200);
    
        const secondAddResponse = await request(BASE_URL)
            .post(`/users/${userId}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId2,
                quantity: 3
            });
        expect(secondAddResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${userId}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.items.length).toBe(2); 
    });
    
    test('should correctly calculate the total price of the cart', async () => {
        const addItemResponse = await request(BASE_URL)
            .post(`/users/${userId}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 2
            });
    
        expect(addItemResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${userId}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.total_price).toBeGreaterThan(0); 
    });
    
    test('should handle adding a very large quantity of an item', async () => {
        const largeQuantity = 10000;

        const response = await request(BASE_URL)
            .post(`/users/${userId}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: largeQuantity
            });
    
        expect(response.statusCode).toBe(400); 
        expect(response.body).toMatchObject({
            code: 400,
            message: 'request body has an error: doesn\'t match schema #/components/schemas/NewCartItem: Error at \"/quantity\": number must be at most 100',
        }); 
    });
    
    test('should return an empty cart when clearing an already empty cart', async () => {
        const clearCartResponse = await request(BASE_URL)
            .post(`/users/${userId}/cart/clear`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .send();
        
        expect(clearCartResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${userId}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.items).toEqual([]); 
    });
    
});

describe('API-15 - Clear User Cart', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-15';
    let createdUser;
    const gameId = '12dc6bb3-cd3f-412a-86fe-3c1dce867481';
    const gameId2 = '1990ecdd-4d3d-4de2-91b9-d45d794c82bc';
    


    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

        const userPayload = {
            email: 'clearcartuser@gmail.com',
            password: 'password123',
            name: 'Cart User',
            nickname: 'clearcart',
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


    }, 10000);

    test('should clear the user cart and return an empty cart on fetch', async () => {
        const addItemPayload = {
            item_uuid: '03dbad48-ad81-433d-9901-dd5332f5d9ee',
            quantity: 5,
        };
        const addToCartResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(addItemPayload);
        expect(addToCartResponse.statusCode).toBe(200);

        const clearCartResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/clear`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .send();
        expect(clearCartResponse.statusCode).toBe(200);

        const getCartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        expect(getCartResponse.statusCode).toBe(200);
        expect(getCartResponse.body.items).toEqual([]);
    });

    test('should return an error when adding an invalid item to the cart', async () => {
        const invalidGameId = 'invalid-game-uuid';
        
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: invalidGameId,
                quantity: 5
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should return an error when adding a negative quantity to the cart', async () => {
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: -5
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should return an error when trying to remove an item not in the cart', async () => {
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/remove`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: 'non-existing-item-uuid'
            });
    
        expect(response.statusCode).toBe(400); 
    });
    
    test('should correctly add multiple different items to the cart', async () => {
        
        const firstAddResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 2
            });
        expect(firstAddResponse.statusCode).toBe(200);
    
        const secondAddResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId2,
                quantity: 3
            });
        expect(secondAddResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.items.length).toBe(2); 
    });
    
    test('should correctly calculate the total price of the cart', async () => {
        const addItemResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: 2
            });
    
        expect(addItemResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.total_price).toBeGreaterThan(0); 
    });
    
    test('should handle adding a very large quantity of an item', async () => {
        const largeQuantity = 10000;
        const response = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/add`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send({
                item_uuid: gameId,
                quantity: largeQuantity
            });
    
        expect(response.statusCode).toBe(400); 
        expect(response.body).toMatchObject({
            code: 400,
            message: 'request body has an error: doesn\'t match schema #/components/schemas/NewCartItem: Error at \"/quantity\": number must be at most 100',
        }); 
    });
    
    test('should return an empty cart when clearing an already empty cart', async () => {
        const clearCartResponse = await request(BASE_URL)
            .post(`/users/${createdUser.uuid}/cart/clear`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .send();
        
        expect(clearCartResponse.statusCode).toBe(200);
    
        const cartResponse = await request(BASE_URL)
            .get(`/users/${createdUser.uuid}/cart`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        
        expect(cartResponse.statusCode).toBe(200);
        expect(cartResponse.body.items).toEqual([]); 
    });
    
});