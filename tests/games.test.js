const request = require('supertest');
const path = require('path');
const fs = require('fs');  

const BASE_URL = 'https://release-gs.qa-playground.com/api/v1';


describe('API-2 - Search Games by Query', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-2';
    const query = 'Atomic Heart';

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();
    }, 5000);

    test('should return all games where the query string matches the name in the response body', async () => {
        const searchResponse = await request(BASE_URL)
            .get(`/games/search?query=${encodeURIComponent(query)}&offset=0&limit=10`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        expect(searchResponse.statusCode).toBe(200);
        const games = searchResponse.body.games;
        expect(games.length).toBeGreaterThan(0);
        games.forEach((game) => {
            expect(game.title).toContain(query);
        });
    });

    test('should return empty array for a query that has no matches', async () => {
        const searchResponse = await request(BASE_URL)
            .get(`/games/search?query=NonExistentGame&offset=0&limit=10`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        expect(searchResponse.statusCode).toBe(200);
        expect(searchResponse.body.games.length).toBe(0);
    });

    test('should return 400 for an invalid query parameter', async () => {
        const searchResponse = await request(BASE_URL)
            .get(`/games/search?query=%$#InvalidQuery&offset=0&limit=10`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        expect(searchResponse.statusCode).toBe(400);
    });

    test('should handle empty query string gracefully', async () => {
        const searchResponse = await request(BASE_URL)
            .get(`/games/search?offset=0&limit=10`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);

        expect(searchResponse.statusCode).toBe(200);
        expect(searchResponse.body.games.length).toBeGreaterThan(0); // Assuming some default behavior when query is empty
    });
});


describe('API-9 - Get Game by UUID', () => {
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-9';

    beforeAll(async () => {
        await request(BASE_URL)
            .post('/setup')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send();
    }, 5000);

    test('should fetch all games and successfully get a particular game by UUID', async () => {
        const getAllGamesResponse = await request(BASE_URL)
            .get('/games?offset=0&limit=10')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        expect(getAllGamesResponse.statusCode).toBe(200);
        const games = getAllGamesResponse.body.games;
        expect(games.length).toBeGreaterThan(0);

        const gameUUID = games[0].uuid;
        const getGameByUUIDResponse = await request(BASE_URL)
            .get(`/games/${gameUUID}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        expect(getGameByUUIDResponse.statusCode).toBe(200);
        expect(getGameByUUIDResponse.body.uuid).toBe(gameUUID);
    });

    test('should return 404 for a non-existent UUID', async () => {
        const nonExistentUUID = 'non-existent-uuid';
        const getGameByUUIDResponse = await request(BASE_URL)
            .get(`/games/${nonExistentUUID}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        expect(getGameByUUIDResponse.statusCode).toBe(400);
    });

    test('should return 401 for invalid token', async () => {
        const invalidToken = 'invalid_token';
        const getAllGamesResponse = await request(BASE_URL)
            .get('/games?offset=0&limit=10')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${invalidToken}`)
            .set('X-Task-Id', taskId);
        expect(getAllGamesResponse.statusCode).toBe(401);
    });

    test('should validate UUID format', async () => {
        const invalidUUID = '123-invalid-uuid';
        const getGameByUUIDResponse = await request(BASE_URL)
            .get(`/games/${invalidUUID}`)
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId);
        expect(getGameByUUIDResponse.statusCode).toBe(400);
    });
});
