import { useState } from 'react';
import TagBadge from '../_components/TagBadge';
import { EditIcon } from 'lucide-react';
import HoverBlocker from '../_components/HoverBlocker';

interface AuthorDescriptionProps {
  author: Author;
  setAuthorSelected: (selected: boolean) => void;
  setAuthorEditing: () => void;
  dayVisible: boolean;
  weekVisible: boolean;
  wordcountVisible: boolean;
}

export default function AuthorDescription({
  author,
  setAuthorSelected,
  setAuthorEditing,
  dayVisible,
  weekVisible,
  wordcountVisible,
}: AuthorDescriptionProps) {
  const [selected, setSelected] = useState(false);
  const [childHover, setChildHover] = useState(false);

  return (
    <div
      className={`description ${selected ? 'selected' : ''} ${childHover ? 'childHover' : ''}`}
      onClick={() => {
        setAuthorSelected(!selected);
        setSelected((prev) => !prev);
      }}
    >
      <EditIcon
        className='description-edit'
        onClick={(e) => {
          e.stopPropagation();
          setAuthorEditing();
        }}
      />
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
      <HoverBlocker setChildHover={setChildHover}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          <span>
            <span>{`Matches: ${author.matches?.length ?? 0}`}</span>
          </span>
        </div>
      </HoverBlocker>
    </div>
  );
}
