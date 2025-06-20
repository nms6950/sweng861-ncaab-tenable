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

router.get('/getTeams', async (req, res) => {
    const query = 'SELECT * FROM ncaab.teams';
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;