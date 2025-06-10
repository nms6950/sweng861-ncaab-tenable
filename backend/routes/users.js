// backend/routes/google.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const pool = require('../config/db.js');

router.post('/createAccount', async (req, res) => {
    const { name, email, password } = req.body;

    const existingUserQuery = 'SELECT * FROM ncaab.users WHERE email = $1';
    const insertUserQuery = 'INSERT INTO ncaab.users (email, name, password, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *'

    try {
        // Check if user with email and provider = manual exists
        const existingUser = await pool.query(existingUserQuery, [email]);

        if (existingUser.rows.length > 0) {
            return res.json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const newUser = await pool.query(insertUserQuery, [email, name, hashedPassword]);
        return res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Internal server error' });   
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const checkExistingUserQuery = 'SELECT * FROM ncaab.users WHERE email = $1'

    try {
        // Check if user with email and provider = manual exists
        const existingUser = await pool.query(checkExistingUserQuery, [email]);
        
        if (existingUser.rows.length === 0) {
            return res.json({ error: 'User not found' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, existingUser.rows[0].password);
        if (!isPasswordValid) {
            return res.json({ error: 'Invalid password' });
        }

        // Update login date
        const updateQuery = 'UPDATE ncaab.users SET updated_at = NOW() WHERE email = $1 RETURNING *';
        await pool.query(updateQuery, [email]);

        // Generate JWT token
        const token = jwt.sign({
            userId: existingUser.rows[0].id,
            email: existingUser.rows[0].email
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        return res.json(existingUser.rows[0]);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;