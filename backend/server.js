// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const usersRoutes = require('./routes/users')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', usersRoutes)

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});