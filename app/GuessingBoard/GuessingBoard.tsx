'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import FicAdd from './FicAdd';
import FicDescription from './FicDescription';
import AuthorAdd from './AuthorAdd';
import { useAuthors, useFics, useMatches } from '../_lib/swrLoaders';
import AuthorDescription from './AuthorDescription';

interface GuessingBoardProps {
  event: EventRecord;
}

export default function GuessingBoard({ event }: GuessingBoardProps) {
  const { event_id: eventId = '', name, link } = event;

  // const { fics, authors, matches } = eventRecord;
  const { fics, isLoading: ficsLoading, mutate: mutateFics } = useFics(eventId);
  const {
    authors,
    isLoading: authorsLoading,
    mutate: mutateAuthors,
  } = useAuthors(eventId);
  const {
    matches,
    isLoading: matchesLoading,
    mutate: mutateMatches,
  } = useMatches(eventId);

  const [ficsVisible, setFicsVisible] = useState(true);
  const [authorsVisible, setAuthorsVisible] = useState(true);
  const [dayVisible, setDayVisible] = useState(true);
  const [wordcountVisible, setWordcountVisible] = useState(true);

  const [selectedFic, setSelectedFic] = useState<Fic | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

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

  // const ficMatches = useMemo(() => {
  //   return matches.reduce((acc: Record<string, FicMatch[]>, match) => {
  //     if (acc[match.fic_id]) acc[match.fic_id] = [...acc[match.fic_id], match];
  //     else acc[match.fic_id] = [match];
  //     return acc;
  //   }, {});
  // }, [matches]);

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
      {name}
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
              addFicCallback={async () => {
                await mutateFics();
              }}
            />
          </div>
        )}
        {authorsVisible && (
          <div>
            <h3>Authors</h3>
            {/* <button onClick={fetchAuthorMetadata}>
              Get all author metadata
            </button> */}
            {authors.map((author) => (
              <AuthorDescription
                key={author.name}
                author={author}
                setAuthorSelected={(selected) =>
                  selected ? setSelectedAuthor(author) : setSelectedAuthor(null)
                }
              />
            ))}
            <AuthorAdd
              addAuthorCallback={async () => {
                await mutateAuthors();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
