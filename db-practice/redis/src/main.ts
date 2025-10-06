import express from 'express';
import { connectRedis } from './config/redis';
import { redisService } from './services/redis.service';

const app = express();
const PORT = 3001;

app.use(express.json());

app.post('/login', async (req, res) => {
  const { username } = req.body;
  const sessionToken = await redisService.login(username);
  res.json({ sessionToken });
});

app.get('/me', async (req, res) => {
  const sessionToken = req.headers['authorization'];
  const username = await redisService.fetchSessionInfo(sessionToken ?? '');
  res.json({ username });
});

app.post('/leaderboard', async (req, res) => {
  const { name, score } = req.body;
  if (!name || score === undefined) {
    return res.status(400).json({ error: 'Name and score are required' });
  }
  await redisService.addToLeaderboard(name, score);
  res.status(200).json({ message: 'Score added to leaderboard' });
});

app.get('/leaderboard', async (req, res) => {
  const leaderboard = await redisService.getLeaderboard();
  res.json({ leaderboard });
});

app.post('/posts', async (req, res) => {
  const { name } = req.body;
  await redisService.addPost({ name, createdAt: Date.now() });
  res.json({ message: 'Post added to storage' });
});

app.get('/posts', async (req, res) => {
  const posts = await redisService.getPost();
  res.json({ posts });
});


async function startServer() {
  await connectRedis();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

