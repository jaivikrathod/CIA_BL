const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = 3005;

const routes = require('./routes/routes');
// Middleware to enable CORS
app.use(cors({
    origin: '*',
    // origin: 'https://jaivikrathod.github.io/',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization','X-User-ID','adminType']
}));

app.use(express.json());

// Routes
app.use('/', routes);

app.get("/", (req, res) => {
    res.send("API is working!");
  });

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
