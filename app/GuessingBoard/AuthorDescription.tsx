import { useState } from 'react';
import TagBadge from '../_components/TagBadge';
import { EditIcon } from 'lucide-react';
import HoverBlocker from '../_components/HoverBlocker';
import { tagSort } from '../_lib/utils';

interface AuthorDescriptionProps {
  author: Author;
  setAuthorEditing: () => void;
  dayVisible: boolean;
  weekVisible: boolean;
  wordcountVisible: boolean;
  isSelected: boolean;
  toggleSelected: () => void;
}

export default function AuthorDescription({
  author,
  setAuthorEditing,
  dayVisible,
  weekVisible,
  wordcountVisible,
  isSelected,
  toggleSelected,
}: AuthorDescriptionProps) {
  const [childHover, setChildHover] = useState(false);

  return (
    <div
      className={`description ${isSelected ? 'selected' : ''} ${childHover ? 'childHover' : ''}`}
      onClick={() => {
        toggleSelected();
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
        {weekVisible && <span>{`Week ${author.weeks?.join(',') ?? ''}`}</span>}
        {dayVisible && <span>{`Day ${author.days?.join(',') ?? ''}`}</span>}
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
        {author.tags
          ?.sort((a, b) => tagSort(a, b))
          ?.map((tag, i) => (
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
