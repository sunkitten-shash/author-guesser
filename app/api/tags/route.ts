import { getDB } from '@/app/_lib/db';
import { NextResponse } from 'next/server';

const { db } = await getDB();

export async function GET() {
  const tags = await db.any<Tag>('SELECT * FROM tag');

  return NextResponse.json<Tag[]>(tags);
}
