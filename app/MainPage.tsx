'use client';

import { useEffect, useState } from 'react';
import EventSelector from './EventSelector';
import { redirect } from 'next/navigation';

// TODO: redo structure a little bit to be more reasonable with the page navigation
export default function MainPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);

  useEffect(() => {
    if (!!selectedEvent) redirect(`/${selectedEvent.event_id}`);
  }, [selectedEvent]);

  return (
    <div id='root' className='dark'>
      <div>
        <h1>Author Guessing Game</h1>
        <EventSelector event={selectedEvent} setEvent={setSelectedEvent} />
      </div>
    </div>
  );
}
