const request = require('supertest');
const server = require('../server');
const pool = require('./../config/db.js');
const axios = require('axios')

jest.mock('./../config/db.js', () => {
    return {
      query: jest.fn(),
      on: jest.fn()
    };
});

jest.mock('axios', () => {
    return {
      get: jest.fn(),
      post: jest.fn()
    };
});

describe('POST /saveStats', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/saveStats returns success msg if there is already an entry in the table', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{}]
        })

        pool.query.mockResolvedValueOnce({
            rows: [{}]
        })

        const response = await request(server).post('/saveStats').send({
            game_id: 0,
            user_id: 0,
            num_correct: 0,
            num_lives: 0,
        });

        expect(response.body.message).toBe('Stats updated successfully')
    });

    it('/saveStats returns success msg if there is not an entry in the table', async () => {
        pool.query.mockResolvedValueOnce({
            rows: []
        })

        pool.query.mockResolvedValueOnce({
            rows: [{}]
        })

        const response = await request(server).post('/saveStats').send({
            game_id: 0,
            user_id: 0,
            num_correct: 0,
            num_lives: 0,
        });

        expect(response.body.message).toBe('Stats saved successfully')
    });
})

describe('GET /getPlayers', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/getPlayers returns rows from the table', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{}, {}, {}]
        })

        const response = await request(server).get('/getPlayers');

        expect(response.body).toEqual([{},{},{}])
    })
})

describe('GET /getGame', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/getGame returns rows from the table', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{}, {}, {}]
        })

        const response = await request(server).get('/getGame').query({date: 0});

        expect(response.body).toEqual([{},{},{}])
    })
})

describe('GET /getMaxDate', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/getMaxDate returns max date for the games available', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{}]
        })

        const response = await request(server).get('/getMaxDate');

        expect(response.body).toEqual({})
    })
})

describe('GET /getIndividualGames', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/getIndividualGames returns rows from the table', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{}, {}, {}]
        })

        const response = await request(server).get('/getIndividualGames').query({user_id: 0});

        expect(response.body).toEqual([{},{},{}])
    })
})

describe('GET /getUserStats', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/getUserStats returns rows from the table', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{}, {}, {}]
        })

        const response = await request(server).get('/getUserStats').query({user_id: 0});

        expect(response.body).toEqual([{},{},{}])
    })
})