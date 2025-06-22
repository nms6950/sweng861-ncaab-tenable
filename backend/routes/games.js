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

router.post('/saveStats', async (req, res) => {
    const game_id = req.body.game_id;
    const user_id = req.body.user_id;
    const num_correct = req.body.num_correct;
    const num_lives = req.body.num_lives;

    // Check if there is already a game saved with that user id
    const query = 'SELECT * FROM ncaab.stats WHERE user_id = $1 AND game_id = $2';
    
    try {
        const result = await pool.query(query, [user_id, game_id]);

        if (result.rows.length) {
            const stats_id = result.rows[0].id;
            const updateQuery = 'UPDATE ncaab.stats SET num_correct = $1 WHERE id = $2';
            await pool.query(updateQuery, [num_correct, stats_id]);
            return res.json({ message: 'Stats updated successfully' });
        } else {
            const insertQuery = 'INSERT INTO ncaab.stats (game_id, user_id, num_lives, num_correct) VALUES ($1, $2, $3, $4)';
            await pool.query(insertQuery, [game_id, user_id, num_lives, num_correct]);
            return res.json({ message: 'Stats saved successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/getPlayers', async (req, res) => {
    const query = `SELECT 
                    P.id, 
                    P.name, 
                    P.position_id, 
                    PO.abbrev AS position_abbrev, 
                    P.team_id, 
                    T.name AS team_name,
                    T.team_abbrev,
                    T.logo_src,
                    P.year, 
                    Y.abbrev,
                    P.home_city, 
                    P."number", 
                    P.redshirt
                    FROM ncaab.players P
                    LEFT JOIN ncaab.year Y ON P.year = Y.id
                    LEFT JOIN ncaab.teams T ON P.team_id = T.id
                    LEFT JOIN ncaab.positions PO ON PO.id = P.position_id`
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

router.get('/getIndividualGames', async (req, res) => {
    const user_id = req.query.user_id;
    const query =  `SELECT G.game_date, S.num_correct
                    FROM ncaab.games G
                    LEFT JOIN ncaab.stats S ON (S.game_id = G.id and S.user_id = $1)`

    try {
        const result = await pool.query(query, [user_id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
    }
})

router.get('/getUserStats', async (req, res) => {
    const user_id = req.query.user_id;
    const query =  `SELECT COUNT(*) as games_played, AVG(num_correct) as avg_score
                    FROM ncaab.stats
                    WHERE user_id = $1`

    try {
        const result = await pool.query(query, [user_id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;