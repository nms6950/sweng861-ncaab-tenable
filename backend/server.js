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

// Serve static frontend from 'public' folder (where your workflow copies frontend build)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRoutes);
app.use('/', gamesRoutes);
app.use('/', teamsRoutes);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
}

// Export the app for testing
module.exports = app;