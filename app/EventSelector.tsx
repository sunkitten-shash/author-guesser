'use client';

import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useEvents } from './_lib/swrLoaders';
import { addEvent } from './_lib/updaters';

interface EventSelectorProps {
  event: EventRecord | null;
  setEvent: Dispatch<SetStateAction<EventRecord | null>>;
}

export default function EventSelector({ event, setEvent }: EventSelectorProps) {
  const [newEvent, setNewEvent] = useState<EventRecord>({ name: '', link: '' });
  const [includeArchived, setIncludeArchived] = useState(false);

  const { events, mutate } = useEvents({ includeArchived });

  const addNewEvent = useCallback(async () => {
    await addEvent(newEvent);
    await mutate();
    setNewEvent({ name: '', link: '' });
  }, [mutate, newEvent]);

  return (
    <div>
      <label htmlFor='event-select'>Pick event to guess for:</label>
      <label htmlFor='include-archived'>Include archived events?</label>
      <input
        type='checkbox'
        name='include-archived'
        checked={includeArchived}
        onChange={(e) => setIncludeArchived(e.target.checked)}
      />
      <select
        name='event-select'
        id='event-select'
        value={event?.name ?? ''}
        onChange={(e) => {
          const newEvent = events.find((ev) => ev.name === e.target.value);
          if (newEvent) setEvent(newEvent);
        }}
      >
        <option value=''>Select event</option>
        {events.map((ev) => (
          <option value={ev.name} key={ev.name}>
            {ev.name}
          </option>
        ))}
      </select>
      <br />
      <input
        type='text'
        value={newEvent.name}
        onChange={(e) =>
          setNewEvent((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder='Name'
      />
      <input
        type='text'
        value={newEvent.link}
        onChange={(e) =>
          setNewEvent((prev) => ({ ...prev, link: e.target.value }))
        }
        placeholder='Link'
      />
      <button
        id='event-add'
        onClick={() => {
          if (!newEvent.name) return;
          addNewEvent();
        }}
      >
        Add event
      </button>
    </div>
  );
}
