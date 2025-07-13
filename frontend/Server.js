// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Redirect /ads.txt to Ezoic
app.get('/ads.txt', (req, res) => {
  res.redirect('https://srv.adstxtmanager.com/76407/movieden.space');
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing (fallback to index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
