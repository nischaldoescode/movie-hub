// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

// Simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Redirect /ads.txt to Ezoic
app.get('/ads.txt', (req, res) => {
  res.redirect('https://srv.adstxtmanager.com/76407/movieden.space');
});

// Serve static files from Vite's build
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to React index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
