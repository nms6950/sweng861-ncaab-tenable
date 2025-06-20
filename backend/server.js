// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usersRoutes = require('./routes/users');
const gamesRoutes = require('./routes/games');
const teamsRoutes = require('./routes/teams');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', usersRoutes);
app.use('/', gamesRoutes);
app.use('/', teamsRoutes);

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});