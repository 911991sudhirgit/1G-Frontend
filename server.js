/**
 * Heroku (and production) server: serves built Angular app and runtime config.
 * Set API_URL on Heroku to your backend URL (e.g. https://your-backend.herokuapp.com/api).
 */
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4200;
const DIST = path.join(__dirname, 'dist', 'realestate-frontend');

// Runtime config: frontend reads this to know the backend API URL
app.get('/config.json', (req, res) => {
  const apiUrl = process.env.API_URL || 'http://localhost:8080/api';
  res.json({ apiUrl });
});

// Angular app (static files)
app.use(express.static(DIST));

// SPA fallback: all other routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
