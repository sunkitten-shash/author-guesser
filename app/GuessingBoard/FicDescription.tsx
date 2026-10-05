import { useState } from 'react';
import TagBadge from './TagBadge';
import HoverBlocker from '../_lib/HoverBlocker';

interface FicDescriptionProps {
  fic: Fic;
  dayVisible: boolean;
  wordcountVisible: boolean;
  setFicSelected: (selected: boolean) => void;
}

export default function FicDescription({
  fic,
  dayVisible,
  wordcountVisible,
  setFicSelected,
}: FicDescriptionProps) {
  const [selected, setSelected] = useState(false);
  const [childHover, setChildHover] = useState(false);

  return (
    <div
      className={`description ${selected ? 'selected' : ''} ${childHover ? 'childHover' : ''}`}
      // TODO: there needs to be some kind of callback to set it as the one being selected for a match
      onClick={() => {
        setFicSelected(!selected);
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
        {dayVisible && <span>{fic.day ?? ''}</span>}
        <span>
          <a
            href={fic.link}
            target='_blank'
            onClick={(e) => e.stopPropagation()}
          >
            {fic.title}
          </a>
        </span>
        {/* TODO: format wc w/ commas */}
        {wordcountVisible && (
          <span>{(fic.wordcount ?? 0).toLocaleString()}</span>
        )}
      </div>
      {/* TODO: tag adding & removal */}
      <HoverBlocker setChildHover={setChildHover}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2px' }}>
          {fic.tags?.map((tag, i) => (
            <TagBadge key={i} tag={tag} />
          ))}
        </div>
      </HoverBlocker>
      {!!fic.notes && <p>{fic.notes}</p>}
      <HoverBlocker setChildHover={setChildHover}>
        <details
          style={{ width: 'fit-content' }}
          onClick={(e) => e.stopPropagation()}
        >
          <summary>Matches</summary>
          {fic.matches?.map((match, i) => (
            <div key={i}>
              {/* TODO: some kind of select? */}
              {/* TODO: tag match badge element? */}
              <span>{match.strength}</span>
              <p>{match.notes}</p>
            </div>
          ))}
          <button onClick={() => console.log('matching for', fic.title)}>
            + Add match
          </button>
        </details>
      </HoverBlocker>
    </div>
  );
}
