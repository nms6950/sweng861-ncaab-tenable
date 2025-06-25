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

describe('GET /getTeams', () => {
    beforeEach(() => {
        pool.query.mockClear();
    });

    it('/getTeams returns rows from the table', async () => {
        pool.query.mockResolvedValueOnce({
            rows: [{}, {}, {}]
        })

        const response = await request(server).get('/getTeams');

        expect(response.body).toEqual([{},{},{}])
    })

    it('/getTeams console logs an error if the database throws one', async () => {
        const error = new Error('DB Error')
        pool.query.mockRejectedValueOnce(error);

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const response = await request(server).get('/getTeams');

        expect(consoleSpy).toHaveBeenCalledWith(error);
        expect(response.body.error).toEqual('Internal Server Error')

        consoleSpy.mockRestore();
    })
})