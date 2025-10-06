import express from 'express';
import { connectDatabase } from './config/database';
import { eventsService } from './services/events.service';

const app = express();
const PORT = 3002;

app.use(express.json());

app.post('/events', async (req, res) => {
  const events = req.body.events;
  const userId = req.body.userId;
  const createdEvents = await eventsService.createEvents(events, userId);
  res.json(createdEvents);
});

app.get('/recent-events/:userId', async (req, res) => {
  const userId = req.params.userId;
  const limit = req.query.limit as string;
  if (!limit) {
    return res.status(400).json({ error: 'Limit is required' });
  }
  const events = await eventsService.getEvents(parseInt(limit), userId);
  res.json(events);
});

app.get('/events/owner/:owner', async (req, res) => {
  const owner = req.params.owner;
  const events = await eventsService.getEventsByOwner(owner);
  res.json(events);
});

app.get('/events/near/:longitude/:latitude/:radius', async (req, res) => {
  const longitude = req.params.longitude;
  const latitude = req.params.latitude;
  const radius = req.params.radius;
  const events = await eventsService.getEventsNearLocation(Number(longitude), Number(latitude), Number(radius));
  res.json(events);
});

async function startServer() {
  await connectDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

