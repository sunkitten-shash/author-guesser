'use server';

import { writeFileSync } from 'fs';
import { getDB } from './db';

export const addEvent = async (event: EventRecord) => {
  const { db } = await getDB();
  const newEvent = await db.one<EventRecord>(
    'INSERT INTO event (name, link, archived) VALUES ($1, $2, $3) RETURNING *',
    [event.name, event.link, event.archived],
  );
  return newEvent.event_id;
};

export const archiveEvent = async (eventId: string) => {
  const { db } = await getDB();
  await db.none('UPDATE event SET archived = true WHERE event_id = $1', [
    eventId,
  ]);
};

export const unarchiveEvent = async (eventId: string) => {
  const { db } = await getDB();
  await db.none('UPDATE event SET archived = false WHERE event_id = $1', [
    eventId,
  ]);
};

export const addTag = async (tag: Tag): Promise<number> => {
  if (tag.tag_id) return tag.tag_id;

  const { db } = await getDB();
  const newId = await db.one<number>(
    `INSERT INTO
    tag (name, category)
  VALUES ($1, $2)
  ON CONFLICT DO UPATE
    SET name=$1
  RETURNING tag_id`,
    [tag.name, tag.category ?? null],
  );

  return newId;
};

export const linkTagToFic = async (tagId: number, ficId: number) => {
  const { db } = await getDB();
  await db.none(
    'INSERT INTO tag_fic (tag_id, fic_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [tagId, ficId],
  );
};

export const addFic = async (fic: Fic) => {
  let tags = fic.tags ?? [];
  const tagIds = await Promise.all(tags.map((tag) => addTag(tag)));
  tags = tags.map((tag, i) => ({ ...tag, tag_id: tagIds[i] }));

  const { db } = await getDB();
  const ficId = await db.one<number>(
    `INSERT INTO
      fic (title, link, day, week, notes, wordcount)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [fic.title, fic.link, fic.day, fic.week, fic.notes, fic.wordcount],
  );

  await Promise.all(tagIds.map((tagId) => linkTagToFic(tagId, ficId)));
};

export const updateShipMappings = async (
  shipMappings: Record<string, string>,
) => {
  writeFileSync('./app/_data/ship_mappings.json', JSON.stringify(shipMappings));
};
