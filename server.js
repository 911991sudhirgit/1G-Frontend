/**
 * Heroku (and production) server: serves built Angular app and runtime config.
 * Set API_URL on Heroku to your backend URL (e.g. https://your-backend.herokuapp.com/api).
 */
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4200;

// When app root is 1G-Frontend: dist is next to server.js. When app root is parent: dist is under 1G-Frontend.
const DIST = fs.existsSync(path.join(__dirname, 'dist', 'realestate-frontend'))
  ? path.join(__dirname, 'dist', 'realestate-frontend')
  : path.join(__dirname, '1G-Frontend', 'dist', 'realestate-frontend');

const indexPath = path.join(DIST, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('Build not found at', indexPath);
}

// Runtime config: frontend reads this to know the backend API URL
app.get('/config.json', (req, res) => {
  const apiUrl = process.env.API_URL || 'http://localhost:8080/api';
  res.json({ apiUrl });
});

// Angular app (static files)
app.use(express.static(DIST));

// SPA fallback: all other routes serve index.html (don't crash if file missing)
app.get('*', (req, res) => {
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(err.status || 500).send(err.message || 'Not found');
    }
  });
});

app.listen(PORT, () => {
  console.log('Serving on port', PORT, 'from', DIST);
});
