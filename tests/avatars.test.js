const request = require('supertest');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://release-gs.qa-playground.com/api/v1';

describe('API-11 Update Avatar Test', () => {
    let createUserId;
    const token = 'qahack2024:ishika2413@gmail.com';
    const taskId = 'api-11';
    
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

        const createUserResponse = await request(BASE_URL)
            .post('/users')
            .set('accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', taskId)
            .set('Content-Type', 'application/json')
            .send(userPayload);

        createUserId = createUserResponse.body.uuid;

        expect(createUserResponse.statusCode).toBe(200);
        expect(createUserResponse.body).toHaveProperty('uuid');
        expect(createUserResponse.body.uuid).toBe(createUserId);
    }, 5000);

    test('should update user avatar successfully', async () => {
        const avatarFilePath = '/Users/naveen/QaHacks/tests/Ishika.jpeg';

        if (!fs.existsSync(avatarFilePath)) {
            throw new Error('Avatar file does not exist');
        }

        const fileStat = fs.statSync(avatarFilePath);
        const fileSize = fileStat.size / (1024 * 1024); 
               expect(fileSize).toBeLessThanOrEqual(5); 
        expect(path.extname(avatarFilePath)).toBe('.jpeg'); 

        const avatarUpdateResponse = await request(BASE_URL)
            .put(`/users/${createUserId}/avatar`)
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${token}`)
            .set('X-Task-Id', 'api-24')
            .attach('avatar_file', avatarFilePath, { contentType: 'image/jpeg' });

        console.log(avatarUpdateResponse.body);

        expect(avatarUpdateResponse.statusCode).toBe(200);
        expect(avatarUpdateResponse.body).toHaveProperty('avatar_url');
        expect(avatarUpdateResponse.body.avatar_url).not.toBeNull();
        
        const avatarUrl = avatarUpdateResponse.body.avatar_url;
        expect(avatarUrl).toMatch(/^https?:\/\//);  
    });

});
