import { getDB } from '@/app/_lib/db';
import { NextRequest, NextResponse } from 'next/server';

const { db } = await getDB();

// TODO: my patterns....
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const id = (await context.params).id;

  // TODO: get the other things as well
  const fics = await db.any<Fic>(
    `SELECT
    *,
    (select to_json(array_agg(row_to_json(t)))
     from (select tag.tag_id, tag.name, tag.category from tag inner join tag_fic on tag.tag_id = tag_fic.tag_id where tag_fic.fic_id = fic.fic_id) t)
        as tags,
    (select to_json(array_agg(row_to_json(m)))
     from (select match.strength, match.notes,
                  (select to_json(array_agg(row_to_json(tm)))
                   from (select tag_match.strength, tag_match.notes, (select to_json(row_to_json(tg)) from (select tag.name, tag.category from tag inner join tag_match on tag.tag_id = tag_match.tag_id) tg) as tag from tag_match where tag_match.match_id = match.match_id) tm)
           from match where match.fic_id = fic.fic_id) m)
        as matches
    FROM fic
    WHERE event = $1`,
    [id],
  );

  return NextResponse.json<Fic[]>(fics);
}
