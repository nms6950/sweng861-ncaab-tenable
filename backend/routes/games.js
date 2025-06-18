// backend/routes/google.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const pool = require('../config/db.js');

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client');
    // optionally, alert or restart logic here
});

router.get('/getPlayers', async (req, res) => {
    const query = 'SELECT * FROM ncaab.players';
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getGame', async (req, res) => {
    const date = req.query.date;
    const query = 'SELECT * FROM ncaab.games WHERE game_date = $1::date';
    try {
        const result = await pool.query(query, [date]);
        res.json(result.rows);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/getMaxDate', async (req, res) => {
    const query = 'SELECT MAX(game_date) FROM ncaab.games';
    try {
        const result = await pool.query(query);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;