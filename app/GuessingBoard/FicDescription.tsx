import { useState } from 'react';
import TagBadge from '../_components/TagBadge';
import HoverBlocker from '../_components/HoverBlocker';
import { EditIcon } from 'lucide-react';

interface FicDescriptionProps {
  fic: Fic;
  setFicEditing: () => void;
  dayVisible: boolean;
  weekVisible: boolean;
  wordcountVisible: boolean;
  isSelected: boolean;
  toggleSelected: () => void;
}

export default function FicDescription({
  fic,
  setFicEditing,
  dayVisible,
  weekVisible,
  wordcountVisible,
  isSelected,
  toggleSelected,
}: FicDescriptionProps) {
  const [childHover, setChildHover] = useState(false);

  return (
    <div
      className={`description ${isSelected ? 'selected' : ''} ${childHover ? 'childHover' : ''}`}
      // TODO: there needs to be some kind of callback to set it as the one being selected for a match
      onClick={() => {
        toggleSelected();
      }}
    >
      <EditIcon
        className='description-edit'
        onClick={(e) => {
          e.stopPropagation();
          setFicEditing();
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        {weekVisible && <span>{`Week ${fic.week ?? ''}`}</span>}
        {dayVisible && <span>{`Day ${fic.day ?? ''}`}</span>}
        <span>
          <a
            href={fic.link}
            target='_blank'
            onClick={(e) => e.stopPropagation()}
          >
            {fic.title}
          </a>
        </span>
        {wordcountVisible && (
          <span>{(fic.wordcount ?? 0).toLocaleString()}</span>
        )}
      </div>
      {/* TODO: tag adding & removal */}
      <div className='tag-wrapper'>
        {fic.tags?.map((tag, i) => (
          <TagBadge key={i} tag={tag} />
        ))}
      </div>
      {!!fic.notes && <p>{fic.notes}</p>}
      <HoverBlocker setChildHover={setChildHover}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span>
            <span>{`Matches: ${fic.matches?.length ?? 0}`}</span>
          </span>
        </div>
      </HoverBlocker>
    </div>
  );
}
