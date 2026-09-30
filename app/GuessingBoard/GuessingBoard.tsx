'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import FicAdd from './FicAdd';
import { getParsed } from '../_lib/utils';
import FicDescription from './FicDescription';
import AuthorAdd from './AuthorAdd';

interface GuessingBoardProps {
  eventName: string;
}

// do we need tanstack table for all the columns......

export default function GuessingBoard({ eventName }: GuessingBoardProps) {
  const LOCAL_STORAGE_PREFIX = useMemo(
    () => `author-guesser_${eventName.split(' ').join('_')}`,
    [eventName],
  );

  const [eventRecord, setEventRecord] = useState<EventRecord>(
    getParsed(`${LOCAL_STORAGE_PREFIX}_eventRecord`, {}),
  );
  const { fics, authors, matches } = eventRecord;
  const [tags, setTags] = useState<Tag[]>(getParsed('author-guesser_tags', []));

  const [ficsVisible, setFicsVisible] = useState(true);
  const [authorsVisible, setAuthorsVisible] = useState(true);
  const [dayVisible, setDayVisible] = useState(true);
  const [wordcountVisible, setWordcountVisible] = useState(true);

  const [selectedFic, setSelectedFic] = useState<Fic | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const updateLocalStorageEventRecord = useCallback(() => {
    window?.localStorage?.setItem(
      `${LOCAL_STORAGE_PREFIX}_eventRecord`,
      JSON.stringify(eventRecord),
    );
  }, [LOCAL_STORAGE_PREFIX, eventRecord]);

  const fetchAuthorMetadata = useCallback(async () => {
    console.log('fetch');
  }, []);

  // TODO: hopefully this won't loop?
  useEffect(
    () =>
      window?.localStorage?.setItem(
        `${LOCAL_STORAGE_PREFIX}_tags`,
        JSON.stringify(tags),
      ),
    [LOCAL_STORAGE_PREFIX, tags],
  );

  useEffect(
    () => console.log({ fics, authors, matches }),
    [fics, authors, matches],
  );

  useEffect(() => {
    if (!!selectedFic && !!selectedAuthor) {
      console.log('match found!');
      console.log(selectedFic, selectedAuthor);
      setSelectedFic(null);
      setSelectedAuthor(null);
    }
    // otherwise do nothing
  }, [selectedFic, selectedAuthor]);

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
        <br />

        <input
          type='checkbox'
          name='day-visible'
          checked={dayVisible}
          onChange={(e) => setDayVisible(e.target.checked)}
        />
        <label htmlFor='day-visible'>Show fic day</label>
        <input
          type='checkbox'
          name='wordcount-visible'
          checked={wordcountVisible}
          onChange={(e) => setWordcountVisible(e.target.checked)}
        />
        <label htmlFor='wordcount-visible'>Show wordcount</label>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        {ficsVisible && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <h3>Fics</h3>
            {fics?.map((fic) => (
              <FicDescription
                key={fic.title}
                fic={fic}
                dayVisible={dayVisible}
                wordcountVisible={wordcountVisible}
                setFicSelected={(selected) =>
                  selected ? setSelectedFic(fic) : setSelectedFic(null)
                }
              />
            ))}
            <FicAdd
              addFicCallback={(fic) =>
                setEventRecord((prev) => ({
                  ...prev,
                  fics: [...(fics ?? []), fic],
                }))
              }
            />
          </div>
        )}
        {authorsVisible && (
          <div>
            <h3>Authors</h3>
            {/* <button onClick={fetchAuthorMetadata}>
              Get all author metadata
            </button> */}
            <AuthorAdd
              addAuthorCallback={(author) =>
                setEventRecord((prev) => ({
                  ...prev,
                  authors: [...(authors ?? []), author],
                }))
              }
            />
          </div>
        )}
      </div>

      <button id='event-record-save' onClick={updateLocalStorageEventRecord}>
        Save
      </button>
    </div>
  );
}
