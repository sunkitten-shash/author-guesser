import { getDB } from '@/app/_lib/db';
import { NextRequest, NextResponse } from 'next/server';

const { db } = await getDB();

// TODO: any in search params
export async function GET() {
  const events = await db.any<Event>('SELECT * FROM event');

  return NextResponse.json<Event[]>(events);
}

export async function PUT(request: NextRequest) {
  const data = await request.json();

  const newEvent = await db.one<Event>(
    'INSERT INTO event (name, link, archived) VALUES ($1, $2, $3) RETURNING *',
    [data.name, data.link, data.archived],
  );
  console.log('new event', newEvent);

  return NextResponse.json<Event>(newEvent);
}
