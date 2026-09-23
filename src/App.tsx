import { useState } from 'react';
import './App.css';
import EventSelector from './EventSelector';

function App() {
  const [event, setEvent] = useState('');

  return (
    <div>
      <h2>Author Guessing Game</h2>
      <EventSelector event={event} setEvent={setEvent} />
    </div>
  );
}

export default App;
