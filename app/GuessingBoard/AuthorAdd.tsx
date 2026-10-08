import { useCallback, useState } from 'react';
import { addAuthor } from '../_lib/updaters';
import AuthorForm from './AuthorForm';

interface AuthorAddProps {
  eventId: string | number;
  addAuthorCallback: () => Promise<void>;
}

export default function AuthorAdd({
  eventId,
  addAuthorCallback,
}: AuthorAddProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [author, setAuthor] = useState<Author>({ name: '' });

  const resetAuthor = useCallback(() => {
    setAuthor({ name: '' });
  }, []);

  return (
    <div>
      {/* TODO: these should be separate so the dialog resets itself */}
      <button onClick={() => setDialogOpen(true)}>+ Add Author</button>
      {dialogOpen && (
        <div>
          <dialog
            style={{
              width: '100%',
            }}
            open={dialogOpen}
          >
            <AuthorForm author={author} setAuthor={setAuthor} />

            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => {
                  resetAuthor();
                  setDialogOpen(false);
                }}
              >
                Close
              </button>
              <button
                onClick={async () => {
                  // TODO: actually add author oops
                  if (!!author.name) {
                    console.log({ author });
                    await addAuthor({ ...author, event_id: eventId });
                    await addAuthorCallback();
                    resetAuthor();
                    setDialogOpen(false);
                  } else {
                    alert('Set author name');
                  }
                }}
              >
                Submit
              </button>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
}
