const express = require('express');
const cors = require('cors');
const app = express();
const port = 3005;

const routes = require('./routes/routes');

// Middleware to enable CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization','X-User-ID'] 
}));

app.use(express.json());

// Routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
