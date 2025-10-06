import { db } from '../config/database';

interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  metadata: Record<string, unknown>;
}

interface EventDTO {
  name: string;
  description: string;
  location: {
    longitude: number;
    latitude: number;
  };
  metadata: Record<string, unknown>;
}

export const eventsService = {
  async createEvents(events: EventDTO[], userId: string): Promise<Event[]> {
    return await db.transaction(async (trx) => {
      const createdEvents: Event[] = [];
      
      for (const event of events) {
        const [created] = await trx('events')
          .insert({
            name: event.name,
            user_id: userId,
            description: event.description,
            location: trx.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)', [event.location.longitude, event.location.latitude]),
            metadata: event.metadata,
          })
          .returning(['id', 'name', 'description', 'metadata', 'created_at', trx.raw('ST_AsText(location) as location')]);
        
        createdEvents.push(created);
      }
      
      return createdEvents;
    });
  },

  async getEvents(limit: number, userId: string): Promise<Event[]> {
    return await db('events')
      .where('user_id', userId)
      .select('id', 'name', 'description', 'metadata', 'created_at')
      .select(db.raw('ST_AsText(location) as location'))
      .limit(limit)
      .orderBy('created_at', 'desc');
  },

  async getEventsByOwner(owner: string): Promise<Event[]> {
    return await db('events')
      .whereRaw("metadata->>'owner' = ?", [owner])
      .select('id', 'name', 'description', 'metadata', 'created_at')
      .select(db.raw('ST_AsText(location) as location'));
  },

  async getEventsNearLocation(longitude: number, latitude: number, radiusKm: number): Promise<Event[]> {
    return await db('events')
      .select('id', 'name', 'description', 'metadata', 'created_at')
      .select(db.raw('ST_AsText(location) as location'))
      .whereRaw(
        'ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, ?)',
        [longitude, latitude, radiusKm * 1000]
      )
      .orderByRaw('ST_Distance(location::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography)', [longitude, latitude]);
  }
};

