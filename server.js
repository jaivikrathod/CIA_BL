const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = 3005;
const routes = require('./routes/routes');

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID', 'adminType']
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/api', routes);

app.get("/api", (req, res) => {
  res.send("API is working!");
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
