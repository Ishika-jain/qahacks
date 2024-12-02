const request = require('supertest');
const path = require('path');
const fs = require('fs');  

const BASE_URL = 'https://release-gs.qa-playground.com/api/v1';

describe('API-10 - Get Games by Category ID', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-10';
    const categoryId = '8126d35b-5336-41ad-981d-f245c3e05665';
    const invalidCategoryId = 'invalid-category-id';

    beforeAll(async () => {
        await request(BASE_URL)
        .post('/setup')
        .set('accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send();
    }, 10000);

    test('should return games where category ID in results matches the searched category ID', async () => {
        const categoryResponse = await request(BASE_URL)
            .get(`/categories/${categoryId}/games?offset=0&limit=10`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        expect(categoryResponse.statusCode).toBe(200);

        const games = categoryResponse.body.games;
        expect(games.length).toBeGreaterThan(0);

        // Ensure category ID in the response matches the searched category ID
        games.forEach((game) => {
            expect(game.category_uuids[0]).toBe(categoryId);
        });
    });


    test('should return 400 for invalid category ID', async () => {
        const categoryResponse = await request(BASE_URL)
            .get(`/categories/invalid-category-id/games?offset=0&limit=10`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        expect(categoryResponse.statusCode).toBe(400);
    });


    test('should return 401 for invalid authentication token', async () => {
        const categoryResponse = await request(BASE_URL)
            .get(`/categories/${categoryId}/games?offset=0&limit=10`)
            .set('accept', 'application/json')
            .set('Authorization', 'Bearer invalid-token')
            .set('X-Task-Id', taskId);

        expect(categoryResponse.statusCode).toBe(401);
    });

    test('should return 400 if required headers are missing', async () => {
        const categoryResponse = await request(BASE_URL)
            .get(`/categories/${categoryId}/games?offset=0&limit=10`)
            .set('accept', 'application/json')
            .set('X-Task-Id', taskId);

        expect(categoryResponse.statusCode).toBe(401);
    });
});
