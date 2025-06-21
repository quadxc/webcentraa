import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for player count (in production, use a database)
let playerCount = 0;

// GET endpoint to fetch current player count
app.get('/api/players', (req, res) => {
  res.json({ count: playerCount });
});

// POST endpoint to update player count (called by MTA script)
app.post('/api/players', (req, res) => {
  const { count } = req.body;
  if (typeof count === 'number' && count >= 0) {
    playerCount = count;
    res.json({ success: true, count: playerCount });
  } else {
    res.status(400).json({ error: 'Invalid player count' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Player count API running on port ${PORT}`);
});

export default app;