import { useCallback, useEffect, useState } from 'react';
import { addTag, getParsed, getTagString } from '../_lib/utils';

interface AuthorAddProps {
  addAuthorCallback: (author: Author) => void;
}

export default function AuthorAdd({ addAuthorCallback }: AuthorAddProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [author, setAuthor] = useState<Author>({ name: '' });

  const [newTag, setNewTag] = useState('');

  const [tags, setTags] = useState<Tag[]>(getParsed('author-guesser_tags', []));

  const resetAuthor = useCallback(() => {
    setAuthor({ name: '' });
  }, []);

  useEffect(() => console.log({ tags }), [tags]);

  const addTagToAuthor = useCallback(
    (tag: Tag | string) => {
      if (!tag) return;

      if (typeof tag === 'string') {
        const tagSplit = tag.split(':');
        tag = {
          name: tagSplit[tagSplit.length - 1],
          ...(tagSplit.length === 2 && { category: tagSplit[0] }),
        };
      }

      const hasTag = author.tags?.find(
        (t) => t.name === tag.name && t.category === tag.category,
      );
      if (hasTag) return;

      setAuthor((prev) => ({
        ...prev,
        tags: [...(prev.tags ?? []), tag],
      }));
      addTag(tag, setTags);
    },
    [author.tags],
  );

  return (
    <div>
      {/* TODO: these should be separate so the dialog resets itself */}
      <button onClick={() => setDialogOpen(true)}>+ Add Author</button>
      {dialogOpen && (
        <div>
          <dialog open={dialogOpen}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor='author-name'>Author name</label>
              <input
                id='author-name'
                type='text'
                value={author.name}
                onChange={(e) =>
                  setAuthor((prev) => ({
                    ...prev,
                    name: e.target.value,
                    link: `https://archiveofourown.org/users/${e.target.value.split(' ').join('')}`,
                  }))
                }
              />

              <label htmlFor='author-link'>AO3 link</label>
              <input
                id='author-link'
                type='text'
                value={author.link}
                onChange={(e) =>
                  setAuthor((prev) => ({ ...prev, link: e.target.value }))
                }
              />
              <a href={author.link} target='_blank'>
                {author.link}
              </a>

              <label htmlFor='author-twitter'>Twitter</label>
              <input
                id='author-twitter'
                type='text'
                value={author.twitter ?? ''}
                onChange={(e) =>
                  setAuthor((prev) => ({ ...prev, twitter: e.target.value }))
                }
              />

              <label htmlFor='author-day'>Day</label>
              <input
                id='author-day'
                type='text'
                value={author.day ?? ''}
                onChange={(e) =>
                  setAuthor((prev) => ({
                    ...prev,
                    day:
                      !!e.target.value && !isNaN(parseInt(e.target.value))
                        ? parseInt(e.target.value)
                        : undefined,
                  }))
                }
              />

              <label htmlFor='author-notes'>Notes</label>
              <textarea
                id='author-notes'
                value={author.notes ?? ''}
                onChange={(e) =>
                  setAuthor((prev) => ({ ...prev, notes: e.target.value }))
                }
              />

              <h4>Tags</h4>
              <p>{author.tags?.map((tag) => getTagString(tag)).join(', ')}</p>
              <select
                name='author-tag-select'
                id='author-tag-select'
                value=''
                onChange={(e) => addTagToAuthor(e.target.value)}
              >
                <option value=''>Select tag</option>
                {tags
                  .sort((a, b) =>
                    getTagString(a).localeCompare(getTagString(b)),
                  )
                  .map((tag) => (
                    <option key={tag.name} value={getTagString(tag)}>
                      {getTagString(tag)}
                    </option>
                  ))}
              </select>

              <input
                id='author-new-tag'
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                onClick={() => {
                  addTagToAuthor(newTag);
                  setNewTag('');
                }}
              >
                + Add New Tag
              </button>
            </div>

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
                onClick={() => {
                  if (!!author.name) {
                    window?.localStorage?.setItem(
                      'author-guesser_tags',
                      JSON.stringify(tags),
                    );
                    console.log({ author });
                    addAuthorCallback(author);
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
