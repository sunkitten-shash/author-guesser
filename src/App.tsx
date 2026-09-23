import { useState } from 'react';
import './App.css';
import EventSelector from './EventSelector';
import GuessingBoard from './GuessingBoard/GuessingBoard';

function App() {
  const [event, setEvent] = useState('');

  return (
    <div>
      <h1>Author Guessing Game</h1>
      <EventSelector event={event} setEvent={setEvent} />
      {!!event && (
        <div>
          <h2>Guessing for {event}</h2>
          <GuessingBoard eventName={event} />
        </div>
      )}
    </div>
  );
}

export default App;
