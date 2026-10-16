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
  const newTag = await db.one<Tag>(
    `INSERT INTO
    tag (name, category)
  VALUES ($1, $2)
  ON CONFLICT (name, category) DO UPDATE
    SET name=$1
  RETURNING *`,
    [tag.name, tag.category ?? null],
  );

  return newTag.tag_id!;
};

export const linkTagToFic = async (tagId: number, ficId: number) => {
  const { db } = await getDB();
  await db.none(
    'INSERT INTO tag_fic (tag_id, fic_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [tagId, ficId],
  );
};

// TODO: transaction this baby
export const addFic = async (fic: Fic) => {
  let tags = fic.tags ?? [];
  const tagIds = await Promise.all(tags.map((tag) => addTag(tag)));
  tags = tags.map((tag, i) => ({ ...tag, tag_id: tagIds[i] }));

  const { db } = await getDB();
  const newFic = await db.one<Fic>(
    `INSERT INTO
      fic (title, link, day, week, notes, wordcount, event)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      fic.title,
      fic.link,
      fic.day,
      fic.week,
      fic.notes,
      fic.wordcount,
      fic.event_id,
    ],
  );

  await Promise.all(tagIds.map((tagId) => linkTagToFic(tagId, newFic.fic_id!)));
};

export const linkTagToAuthor = async (tagId: number, authorId: number) => {
  const { db } = await getDB();
  await db.none(
    'INSERT INTO tag_author (tag_id, author_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [tagId, authorId],
  );
};

export const addAuthor = async (author: Author) => {
  let tags = author.tags ?? [];
  const tagIds = await Promise.all(tags.map((tag) => addTag(tag)));
  tags = tags.map((tag, i) => ({ ...tag, tag_id: tagIds[i] }));

  const { db } = await getDB();
  const newAuthor = await db.one<Author>(
    `INSERT INTO
      author (name, link, twitter, notes, day, week, wordcount, number, event)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      author.name,
      author.link,
      author.twitter,
      author.notes,
      author.day,
      author.week,
      author.wordcount,
      author.number,
      author.event_id,
    ],
  );
  console.log({ newAuthor });

  await Promise.all(
    tagIds.map((tagId) => linkTagToAuthor(tagId, newAuthor.author_id!)),
  );
};

export const updateAuthor = async (author: Author) => {
  const { db } = await getDB();

  const updatedAuthor = await db.one<Author>(
    `UPDATE author SET
      name = $1,
      link = $2,
      twitter = $3,
      notes = $4,
      day = $5,
      week = $6,
      wordcount = $7,
      number = $8
    WHERE author_id = $9
    RETURNING *`,
    [
      author.name,
      author.link,
      author.twitter,
      author.notes,
      author.day,
      author.week,
      author.wordcount,
      author.number,
      author.author_id,
    ],
  );

  console.log({ updatedAuthor });

  let tags = author.tags ?? [];
  const tagIds = await Promise.all(tags.map((tag) => addTag(tag)));
  tags = tags.map((tag, i) => ({ ...tag, tag_id: tagIds[i] }));

  await Promise.all(
    tagIds.map((tagId) => linkTagToAuthor(tagId, updatedAuthor.author_id!)),
  );
};

export const updateShipMappings = async (
  shipMappings: Record<string, string>,
) => {
  writeFileSync('./app/_data/ship_mappings.json', JSON.stringify(shipMappings));
};
