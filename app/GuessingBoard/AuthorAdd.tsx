import { useCallback, useEffect, useState } from 'react';
import { addAuthor, updateAuthor } from '../_lib/updaters';
import AuthorForm from './AuthorForm';

interface AuthorAddProps {
  eventId: string | number;
  editingAuthor: Author | null;
  submitCallback: () => Promise<void>;
}

export default function AuthorAdd({
  eventId,
  editingAuthor,
  submitCallback,
}: AuthorAddProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [author, setAuthor] = useState<Author>({ name: '' });

  useEffect(() => {
    if (editingAuthor) {
      setAuthor(editingAuthor);
      setDialogOpen(true);
    }
  }, [editingAuthor]);

  const resetAuthor = useCallback(() => {
    setAuthor({ name: '' });
  }, []);

  return (
    <div>
      {/* TODO: these should be separate so the dialog resets itself */}
      <button onClick={() => setDialogOpen(true)}>+ Add Author</button>
      {dialogOpen && (
        <div>
          <dialog className='dialog' open={dialogOpen}>
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
                    if (author.author_id) await updateAuthor(author);
                    else await addAuthor({ ...author, event_id: eventId });
                    await submitCallback();
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
