import { getDB } from './db';

export const eventLoader = async (id: string) => {
  const { db } = await getDB();

  const result = db.one<EventRecord>(
    'SELECT * FROM event WHERE event_id = $1',
    [id],
  );
  return result;
};

export const eventsLoader = async (includeArchived = false) => {
  const { db } = await getDB();
  const events = await db.any<Event>(
    `SELECT * FROM event ${!includeArchived ? 'WHERE archived is not true' : ''}`,
  );
  console.log({ events });
  return events;
};
