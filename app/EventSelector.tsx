'use client';

import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

interface EventSelectorProps {
  event: string;
  setEvent: Dispatch<SetStateAction<string>>;
}

const EVENT_OPTIONS_KEY = 'author-guesser_eventOptions';

export default function EventSelector({ event, setEvent }: EventSelectorProps) {
  const [eventOptions, setEventOptions] = useState<string[]>([]);
  const [newEventName, setNewEventName] = useState('');

  useEffect(() => {
    const options = window?.localStorage?.getItem(EVENT_OPTIONS_KEY);
    if (options) {
      setEventOptions(JSON.parse(options));
    }
  }, []);

  // useEffect(() => console.log({ eventOptions }), [eventOptions]);

  const updateLocalStorageEventOptions = useCallback(
    (newOption: string) => {
      if (eventOptions.includes(newOption)) return;
      window?.localStorage?.setItem(
        EVENT_OPTIONS_KEY,
        JSON.stringify([...eventOptions, newOption]),
      );
    },
    [eventOptions],
  );

  return (
    <div>
      <label htmlFor='event-select'>Pick event to guess for:</label>
      <select
        name='event-select'
        id='event-select'
        value={event}
        onChange={(e) => setEvent(e.target.value)}
      >
        <option value=''>Select event</option>
        {eventOptions.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
      <br />
      <input
        type='text'
        value={newEventName}
        onChange={(e) => setNewEventName(e.target.value)}
      />
      <button
        id='event-add'
        onClick={() => {
          if (!newEventName) return;
          setEventOptions((prev) => [...prev, newEventName]);
          updateLocalStorageEventOptions(newEventName);
          setNewEventName('');
        }}
      >
        Add event
      </button>
    </div>
  );
}
