'use server';

// nextjs is evil actually it only likes pgpromise in server side but doesn't let you export it. boooo
import pgPromise, { IDatabase } from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';
import { createSingleton } from './utils';

const pgp = pgPromise();
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
// let dbObj: IDatabase<{}, pg.IClient> | null = null;

// const getDb = () => {
//   if (!dbObj) {
//     dbObj = pgp(process.env.CONNECTION_STRING || '');
//   }
//   return dbObj;
// };

// getDb();
// const db = pgp(process.env.CONNECTION_STRING || '');

// module.exports = {
//   db,
// };

// Source - https://stackoverflow.com/a/34427278
// Posted by vitaly-t, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-04, License - CC BY-SA 4.0

interface IDatabaseScope {
  db: pgPromise.IDatabase<any>;
}

export async function getDB(): Promise<IDatabaseScope> {
  return createSingleton<IDatabaseScope>('db', () => {
    return {
      db: pgp(process.env.CONNECTION_STRING || ''),
    };
  });
}
