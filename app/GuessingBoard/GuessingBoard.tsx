'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import FicAdd from './FicAdd';
import FicDescription from './FicDescription';
import AuthorAdd from './AuthorAdd';
import { useAuthors, useFics, useMatches } from '../_lib/swrLoaders';
import AuthorDescription from './AuthorDescription';
import { getTagOverlap, setAsNum } from '../_lib/utils';
import TagFilterSelector from '../_components/TagFilterSelector';
import Filters from '../_components/Filters';

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
  const bothVisible = useMemo(
    () => ficsVisible && authorsVisible,
    [authorsVisible, ficsVisible],
  );
  const [dayVisible, setDayVisible] = useState(false);
  const [weekVisible, setWeekVisible] = useState(true);
  const [wordcountVisible, setWordcountVisible] = useState(true);

  const [selectedFic, setSelectedFic] = useState<Fic | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const [editingFic, setEditingFic] = useState<Fic | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const [generalFilter, setGeneralFilter] = useState<GeneralFilter>({});
  const [ficFilter, setFicFilter] = useState<GenericFilter>({});
  const [authorFilter, setAuthorFilter] = useState<GenericFilter>({});

  const { week, day, fic, author } = generalFilter;
  const {
    tags: ficTags,
    operator: ficOperator,
    unmatchedOnly: ficUnmatchedOnly,
  } = ficFilter;
  const {
    tags: authorTags,
    operator: authorOperator,
    unmatchedOnly: authorUnmatchedOnly,
  } = authorFilter;

  const availableWeeks = useMemo(() => {
    let weeks = fics.map((fic) => fic.week);
    weeks = weeks.concat(authors.flatMap((author) => author.weeks));
    weeks = weeks.filter(Boolean);
    return Array.from(new Set(weeks)).toSorted() as number[];
  }, [authors, fics]);

  const availableDays = useMemo(() => {
    let days = fics.map((fic) => fic.day);
    days = days.concat(authors.flatMap((author) => author.days));
    days = days.filter(Boolean);
    return Array.from(new Set(days)).toSorted() as number[];
  }, [authors, fics]);

  const filteredFics = useMemo(() => {
    if (fic) return [fic];
    let filtered = fics;

    // TODO: more optimization? not super worried about it rn it's like. max 20 or 30 tbh
    if (week) filtered = filtered.filter((fic) => fic.week === week);
    if (day) filtered = filtered.filter((fic) => fic.day === day);

    if (ficUnmatchedOnly)
      filtered = filtered.filter((fic) => !fic.matches?.length);

    if (ficTags?.length) {
      if (ficOperator === 'AND') {
        filtered = filtered.filter(
          (fic) =>
            getTagOverlap(ficTags, fic.tags ?? []).length === ficTags.length,
        );
      } else {
        filtered = filtered.filter(
          (fic) => !!getTagOverlap(ficTags, fic.tags ?? []).length,
        );
      }
    }

    return filtered;
  }, [day, fic, ficOperator, ficTags, ficUnmatchedOnly, fics, week]);

  const filteredAuthors = useMemo(() => {
    if (author) return [author];
    let filtered = authors;

    if (week)
      filtered = filtered.filter((author) => author.weeks?.includes(week));
    if (day) filtered = filtered.filter((author) => author.days?.includes(day));

    if (authorUnmatchedOnly)
      filtered = filtered.filter((author) => !author.matches?.length);

    if (authorTags?.length) {
      if (authorOperator === 'AND') {
        filtered = filtered.filter(
          (author) =>
            getTagOverlap(authorTags, author.tags ?? []).length ===
            authorTags.length,
        );
      } else {
        filtered = filtered.filter(
          (author) => !!getTagOverlap(authorTags, author.tags ?? []).length,
        );
      }
    }

    return filtered;
  }, [
    author,
    authorOperator,
    authorTags,
    authorUnmatchedOnly,
    authors,
    day,
    week,
  ]);

  useEffect(
    () => console.log({ fics, authors, matches }),
    [fics, authors, matches],
  );

  useEffect(
    () => console.log({ generalFilter, ficFilter, authorFilter }),
    [authorFilter, ficFilter, generalFilter],
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

  useEffect(
    () => console.log({ selectedFic, selectedAuthor }),
    [selectedFic, selectedAuthor],
  );

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
        <label htmlFor='day-visible'>Show day</label>
        <input
          type='checkbox'
          name='week-visible'
          checked={weekVisible}
          onChange={(e) => setWeekVisible(e.target.checked)}
        />
        <label htmlFor='week-visible'>Show week</label>
        <input
          type='checkbox'
          name='wordcount-visible'
          checked={wordcountVisible}
          onChange={(e) => setWordcountVisible(e.target.checked)}
        />
        <label htmlFor='wordcount-visible'>Show wordcount</label>
      </div>
      <br />
      <h3>Filters</h3>
      <label htmlFor='filter-week'>Week:</label>
      <select
        id='filter-week'
        value={week?.toString() ?? ''}
        onChange={(e) =>
          setGeneralFilter((prev) => ({
            ...prev,
            week: setAsNum(e.target.value),
          }))
        }
      >
        <option value=''>{`(none)`}</option>
        {availableWeeks.map((w) => (
          <option key={w} value={w.toString()}>
            {w.toString()}
          </option>
        ))}
      </select>
      &nbsp;
      <label htmlFor='filter-day'>Day:</label>
      <select
        id='filter-day'
        value={day?.toString() ?? ''}
        onChange={(e) =>
          setGeneralFilter((prev) => ({
            ...prev,
            day: setAsNum(e.target.value),
          }))
        }
      >
        <option value=''>{`(none)`}</option>
        {availableDays.map((d) => (
          <option key={d} value={d.toString()}>
            {d.toString()}
          </option>
        ))}
      </select>
      &nbsp;
      <button
        onClick={() => {
          setGeneralFilter({});
          setFicFilter({});
          setAuthorFilter({});
        }}
      >
        Clear all filters
      </button>
      <br />
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
              ...(bothVisible ? { width: '45%' } : {}),
            }}
          >
            <h3>Fics</h3>
            <Filters
              filter={ficFilter}
              setFilter={(updatedFilter) =>
                setFicFilter((prev) => ({ ...prev, ...updatedFilter }))
              }
            />
            {filteredFics?.map((fic) => (
              <FicDescription
                key={fic.title}
                fic={fic}
                setFicEditing={() => setEditingFic(fic)}
                dayVisible={dayVisible}
                weekVisible={weekVisible}
                wordcountVisible={wordcountVisible}
                isSelected={fic.fic_id === selectedFic?.fic_id}
                toggleSelected={() =>
                  fic.fic_id === selectedFic?.fic_id
                    ? setSelectedFic(null)
                    : setSelectedFic(fic)
                }
                toggleHighlighted={() => {
                  if (fic.fic_id === generalFilter.fic?.fic_id) {
                    setGeneralFilter((prev) => ({ ...prev, fic: null }));
                    setSelectedFic(null);
                  } else {
                    setGeneralFilter((prev) => ({ ...prev, fic }));
                    setSelectedFic(fic);
                  }
                }}
              />
            ))}
            <FicAdd
              eventId={event.event_id!}
              editingFic={editingFic}
              addFicCallback={async () => {
                await mutateFics();
              }}
            />
          </div>
        )}
        {authorsVisible && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              ...(bothVisible ? { width: '45%' } : {}),
            }}
          >
            <h3>Authors</h3>
            {/* <button onClick={fetchAuthorMetadata}>
              Get all author metadata
            </button> */}
            <Filters
              filter={authorFilter}
              setFilter={(updatedFilter) =>
                setAuthorFilter((prev) => ({ ...prev, ...updatedFilter }))
              }
            />
            {filteredAuthors.map((author) => (
              <AuthorDescription
                key={author.name}
                author={author}
                setAuthorEditing={() => setEditingAuthor(author)}
                dayVisible={dayVisible}
                weekVisible={weekVisible}
                wordcountVisible={wordcountVisible}
                isSelected={author.author_id === selectedAuthor?.author_id}
                toggleSelected={() =>
                  author.author_id === selectedAuthor?.author_id
                    ? setSelectedAuthor(null)
                    : setSelectedAuthor(author)
                }
              />
            ))}
            <AuthorAdd
              eventId={event.event_id!}
              editingAuthor={editingAuthor}
              submitCallback={async () => {
                await mutateAuthors();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
