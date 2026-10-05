import GuessingBoard from '../GuessingBoard/GuessingBoard';
import { eventLoader } from '../_lib/loaders';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const event = await eventLoader(id);

  console.log(event);

  return (
    <div id='root'>
      <h1>Author Guessing Game</h1>
      <div>
        <h2>
          Guessing for{' '}
          <a href={event.link} target='_blank'>
            {event.name}
          </a>
        </h2>
        <GuessingBoard event={event} />
      </div>
    </div>
  );
}
