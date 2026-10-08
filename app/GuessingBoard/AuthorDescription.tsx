import { useState } from 'react';
import TagBadge from '../_components/TagBadge';

interface AuthorDescriptionProps {
  author: Author;
  setAuthorSelected: (selected: boolean) => void;
  dayVisible: boolean;
  weekVisible: boolean;
  wordcountVisible: boolean;
}

export default function AuthorDescription({
  author,
  setAuthorSelected,
  dayVisible,
  weekVisible,
  wordcountVisible,
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
        {weekVisible && <span>{`Week ${author.week ?? ''}`}</span>}
        {dayVisible && <span>{`Day ${author.day ?? ''}`}</span>}
        <span>
          <a
            href={author.link ?? ''}
            target='_blank'
            onClick={(e) => e.stopPropagation()}
          >
            {author.name}
          </a>
        </span>
        {wordcountVisible && (
          <span>{(author.wordcount ?? 0).toLocaleString()}</span>
        )}
      </div>
      <div className='tag-wrapper'>
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
