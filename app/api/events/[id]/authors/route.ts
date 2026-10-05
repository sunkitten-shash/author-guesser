import { getDB } from '@/app/_lib/db';
import { NextRequest, NextResponse } from 'next/server';

const { db } = await getDB();

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const id = (await context.params).id;

  const authors = await db.any<Author>(
    `SELECT *, (select to_json(array_agg(row_to_json(t)))
    from (select tag.tag_id, tag.name, tag.category from tag inner join tag_author on tag.tag_id = tag_author.tag_id where tag_author.author_id = author.author_id) t) as tags
    FROM author
    WHERE event = $1`,
    [id],
  );

  return NextResponse.json<Author[]>(authors);
}
