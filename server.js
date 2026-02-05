/**
 * Heroku (and production) server: serves built Angular app and runtime config.
 * Set API_URL on Heroku to your backend URL (e.g. https://your-backend.herokuapp.com/api).
 */
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled rejection at:', p, 'reason:', reason);
});

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
  const apiUrl = process.env.API_URL || 'https://og-backend-ec80a37e82c0.herokuapp.com/api';
  res.json({ apiUrl });
});

// Angular app (static files)
app.use(express.static(DIST));

// SPA fallback: any request not handled above gets index.html (no wildcard route; Express 5 rejects '*' and '/:path(*)')
app.use((req, res) => {
  if (req.method === 'GET') {
    res.sendFile(indexPath, {}, (err) => {
      if (err) {
        res.status(err.status || 500).send(err.message || 'Not found');
      }
    });
  } else {
    res.status(404).send('Not found');
  }
});

const server = app.listen(PORT, () => {
  console.log('Serving on port', PORT, 'from', DIST);
});
server.on('error', (err) => {
  console.error('Server listen error:', err);
  process.exit(1);
});
