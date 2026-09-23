import { useCallback, useEffect, useMemo, useState } from 'react';

interface GuessingBoardProps {
  eventName: string;
}

// do we need tanstack table for all the columns......

const getParsed = (key: string, fallback?: unknown) => {
  return JSON.parse(
    window?.localStorage?.getItem(key) ?? JSON.stringify(fallback),
  );
};

export default function GuessingBoard({ eventName }: GuessingBoardProps) {
  const LOCAL_STORAGE_PREFIX = useMemo(
    () => `author-guesser_${eventName.split(' ').join('_')}`,
    [eventName],
  );

  const [eventRecord, setEventRecord] = useState<EventRecord>(
    getParsed(`${LOCAL_STORAGE_PREFIX}_eventRecord`, {}),
  );
  const [tags, setTags] = useState<Tag[]>(getParsed('author-guesser_tags', []));

  const [ficsVisible, setFicsVisible] = useState(true);
  const [authorsVisible, setAuthorsVisible] = useState(true);

  const updateLocalStorageEventRecord = useCallback(() => {
    window?.localStorage?.setItem(
      `${LOCAL_STORAGE_PREFIX}_eventRecord`,
      JSON.stringify(eventRecord),
    );
  }, [LOCAL_STORAGE_PREFIX, eventRecord]);

  // TODO: hopefully this won't loop?
  useEffect(
    () =>
      window?.localStorage?.setItem(
        `${LOCAL_STORAGE_PREFIX}_tags`,
        JSON.stringify(tags),
      ),
    [LOCAL_STORAGE_PREFIX, tags],
  );

  // separate components for author & fic boards
  // probably do like { authors, fics, ... } instead of just eventRecord
  // or separately to make it easier to save it?
  // autosaving would be *nice* but not needed
  // authors can have a number that gets matched too (bc sometimes I know it's a Lot)
  // and a component for filtering
  // that should get tags
  // or should it just be in here.....
  // girl. context would be Too Much tbh
  return (
    <div>
      {eventName}
      {/* column visibility */}
      <div>
        <input
          type='checkbox'
          name='fics-visible'
          checked={ficsVisible}
          onChange={(e) => setFicsVisible(e.target.checked)}
        />
        <label htmlFor='fics-visible'>Show fics</label>

        <br />
        <input
          type='checkbox'
          name='authors-visible'
          checked={authorsVisible}
          onChange={(e) => setAuthorsVisible(e.target.checked)}
        />
        <label htmlFor='authors-visible'>Show authors</label>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        {ficsVisible && (
          <div>
            <h3>Fics</h3>
          </div>
        )}
        {authorsVisible && (
          <div>
            <h3>Authors</h3>
          </div>
        )}
      </div>

      <button id='event-record-save' onClick={updateLocalStorageEventRecord}>
        Save
      </button>
    </div>
  );
}
