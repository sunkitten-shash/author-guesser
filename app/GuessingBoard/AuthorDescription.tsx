import { useState } from 'react';
import TagBadge from './TagBadge';

interface AuthorDescriptionProps {
  author: Author;
  setAuthorSelected: (selected: boolean) => void;
}

export default function AuthorDescription({
  author,
  setAuthorSelected,
}: AuthorDescriptionProps) {
  const [selected, setSelected] = useState(false);

  return (
    <div
      className={`description ${selected ? 'selected' : ''}`}
      onClick={() => {
        setAuthorSelected(!selected);
        setSelected((prev) => !prev);
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <span>
          <a
            href={author.link ?? ''}
            target='_blank'
            onClick={(e) => e.stopPropagation()}
          >
            {author.name}
          </a>
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '2px' }}>
        {author.tags?.map((tag, i) => (
          <TagBadge key={i} tag={tag} />
        ))}
      </div>
      {!!author.notes && <p>{author.notes}</p>}
      <details
        style={{ width: 'fit-content' }}
        onClick={(e) => e.stopPropagation}
      >
        <summary>Matches</summary>
        {/* TODO: matches...aren't currently linked in to author? man. i just want a real database. */}
        {/* {!!author.number && <p>{`${author.matches?.length ?? 0}/${author.number}`}</p>} */}
      </details>
    </div>
  );
}
