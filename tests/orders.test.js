const request = require('supertest');

const BASE_URL = 'https://release-gs.qa-playground.com/api/v1'; 

describe('API-16: Create a new Order', () => {
    const token = 'qahack2024:ishika2413@gmail.com'; 
    const taskId = 'api-16';
    let createUserResponse, userId, orderId;


    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();

        const userPayload = {
            email: 'ishika@example.com',
            password: 'ishika',
            name: 'ishika',
            nickname: 'ishika',
        };
                    
        createUserResponse = await request(BASE_URL)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId) 
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(userPayload);    

        expect(createUserResponse.status).toBe(200);
        userId = createUserResponse.body.uuid;
    }, 10000);
    
    test('Create order success', async () => {
        const orderPayload = {
            items: [
                { item_uuid: "1990ecdd-4d3d-4de2-91b9-d45d794c82bc", quantity: 2 },
                { item_uuid: "0378c074-92d6-4d8c-b6d3-878c08dbe27f", quantity: 1 }
            ]
        };

        const createOrderResponse = await request(BASE_URL)
            .post(`/users/${userId}/orders`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(orderPayload);

        orderId = createOrderResponse.body.uuid;
        expect(createOrderResponse.status).toBe(200);
        expect(createOrderResponse.body.status).toBe('open');
        expect(createOrderResponse.body).toHaveProperty('uuid');
    });

    test('Create order with invalid item', async () => {
        const payload = {
            items: [{ item_uuid: "0378c074-92d6-4d8c-b6d3-878c08dbe11f", quantity: 2 }]
        };

        const response = await request(BASE_URL)
            .post(`/users/${userId}/orders`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);

        expect(response.status).toBe(404);
    });

    test('Create order exceeding quantity limit', async () => {
        const payload = {
            items: [{ item_uuid: "1990ecdd-4d3d-4de2-91b9-d45d794c82bc", quantity: 101 }]
        };

        const response = await request(BASE_URL)
            .post(`/users/${userId}/orders`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);

            expect([400, 404]).toContain(response.status);
        });

    test('Create order with missing items field', async () => {
        const payload = {}; 

        const response = await request(BASE_URL)
            .post(`/users/${userId}/orders`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);

            expect([400, 404]).toContain(response.status);
        });

    test('Create order with invalid payload structure', async () => {
        const payload = { "invalid_field": "some value" };

        const response = await request(BASE_URL)
            .post(`/users/${userId}/orders`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);

            expect([400, 404]).toContain(response.status);
        });

    test('Create order with duplicate items', async () => {
        const duplicate_item_uuid = "0378c074-92d6-4d8c-b6d3-878c08dbe27f";
        const payload = {
            items: [
                { item_uuid: duplicate_item_uuid, quantity: 1 },
                { item_uuid: duplicate_item_uuid, quantity: 2 }
            ]
        };

        const response = await request(BASE_URL)
            .post(`/users/${userId}/orders`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);

            expect([400, 404]).toContain(response.status);
        expect(response.body).toHaveProperty('message');
    });

});

describe('API-17: List Orders', () => {
    const token = "qahack2024:ishika2413@gmail.com";
    const taskId = "api-17";
    let userUuid;

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        
        const userPayload = {
            email: 'ishika@example.com',
            password: 'ishika',
            name: 'ishika',
            nickname: 'ishika',
        };
        
        const createUserResponse = await request(BASE_URL)
            .post('/users')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send(userPayload);

        expect(createUserResponse.status).toBe(200);
        userUuid = createUserResponse.body.uuid;
    }, 10000);

    test('List orders success', async () => {
        const response = await request(BASE_URL)
            .get(`/users/${userUuid}/orders`)
            .set('accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Task-Id', taskId)
        .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        const jsonData = response.body;
        expect(jsonData).toHaveProperty('orders');
        expect(jsonData).toHaveProperty('meta');
        expect(Array.isArray(jsonData.orders)).toBe(true);
    });

    test('Invalid user UUID', async () => {
        const invalidUuid = "997769a2-d303-4686-b410-c6616a5bda99";
        const response = await request(BASE_URL)
            .get(`/users/${invalidUuid}/orders`)
            .set('accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Task-Id', taskId)
        .set('Content-Type', 'application/json')
        expect(response.status).toBe(404);
    });


 

    test('Sorting order', async () => {
        const response = await request(BASE_URL)
            .get(`/users/${userUuid}/orders`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
        expect(response.status).toBe(200);
        const orders = response.body.orders;
        const timestamps = orders.map(order => order.created_at);
        expect(timestamps).toEqual(timestamps.sort((a, b) => new Date(b) - new Date(a)));
    });

    test('Large offset', async () => {
        const params = { offset: 1000000, limit: 10 };
        const response = await request(BASE_URL)
            .get(`/users/${userUuid}/orders`)
            .set('accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Task-Id', taskId)
        .set('Content-Type', 'application/json')
            .query(params);
        expect(response.status).toBe(200);
        const jsonData = response.body;
        expect(jsonData.orders).toEqual([]);
    });

    test('Rate limiting', async () => {
        const responses = [];
        for (let i = 0; i < 5; i++) {
            const response = await request(BASE_URL)
                .get(`/users/${userUuid}/orders`)
                .set('accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Task-Id', taskId)
        .set('Content-Type', 'application/json')
                responses.push(response);
        }
        const statusCodes = responses.map(response => response.status);
        expect(statusCodes.every(code => code === 200)).toBe(true);
    });

    test('Offset', async () => {
        const params = { offset: 5, limit: 5 };
        const response = await request(BASE_URL)
            .get(`/users/${userUuid}/orders`)
            .set('accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('X-Task-Id', taskId)
        .set('Content-Type', 'application/json')
            .query(params);
        expect(response.status).toBe(200);
        const jsonData = response.body;
        expect(jsonData.orders.length).toBeLessThanOrEqual(5);
    });

});

describe('Update Order Status', () => {
    const token = "qahack2024:proxy.vqz2d@simplelogin.com"; 
    const taskId = "api-18";
    let orderId;  

    beforeAll(async () => {
        const payload = {
            "status": "pending", 
            "items": [{ "product_id": "12345", "quantity": 1 }] 
        };
        const response = await request(BASE_URL)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);
        
        orderId = response.body.uuid;  
    }, 10000);

    test('Update order status to canceled fail', async () => {
        const payload = {
            "status": "canceled"
        };
        const response = await request(BASE_URL)
            .patch(`/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);

            expect([400,404]).toContain(response.status);
            const jsonData = response.body;
        expect(jsonData.code).toBe(404);
        expect(jsonData.message).toContain('canceled');
    });

    test('Update order status to invalid status', async () => {
        const url = `${BASE_URL}/orders/${orderId}/status`;
        const payload = {
            "status": "invalid_status"
        };
        const response = await request(BASE_URL)
            .patch(url)
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);

        expect(response.status).toBe(404);
        const jsonData = response.body;
        expect(jsonData).toHaveProperty('code');
        expect(jsonData).toHaveProperty('message');
        expect(jsonData.code).toBe(404);
        expect(jsonData.message).toContain('not found');
    });

    test('Update completed order status', async () => {
        const payload = {
            "status": "canceled"
        };
        const response = await request(BASE_URL)
            .patch(`/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);

        expect([400,404]).toContain(response.status);
        const jsonData = response.body;
        expect(jsonData.message).toContain('completed');
    });

    test('Update order status unauthorized', async () => {
        const payload = {
            "status": "canceled"
        };
        const response = await request(BASE_URL)
            .patch(`/orders/${orderId}/status`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(payload);

            expect(response.status).toBe(401);
            expect(response.text).toContain("authentication failed");
    });

});
