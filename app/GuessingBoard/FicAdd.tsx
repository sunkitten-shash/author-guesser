import { useCallback, useState } from 'react';
import { fetchWorkMetadata } from '../_lib/ao3Utils';
import { addTag, getParsed, getTagString } from '../_lib/utils';

interface FicAddProps {
  addFicCallback: (fic: Fic) => void;
}

export default function FicAdd({ addFicCallback }: FicAddProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fic, setFic] = useState<Fic>({ title: '', link: '' });

  const [tagMappings] = useState<Record<string, string>>(
    getParsed(`author-guesser_tagMappings`, {}),
  );
  const [mappedRelationships, setMappedRelationships] = useState<
    Record<string, string>
  >({});
  const [relationshipList, setRelationshipList] = useState<string[]>([]);

  const [tags, setTags] = useState<Tag[]>(getParsed('author-guesser_tags', []));

  const saveMappedRelationships = useCallback(() => {
    const newTagMappings = { ...tagMappings, mappedRelationships };
    window?.localStorage?.setItem(
      `author-guesser_tagMappings`,
      JSON.stringify(newTagMappings),
    );
  }, [mappedRelationships, tagMappings]);

  const addTagToFic = useCallback(
    (tag: Tag | string) => {
      if (typeof tag === 'string') {
        const tagSplit = tag.split(':');
        tag = {
          name: tagSplit[tagSplit.length - 1],
          ...(tagSplit.length === 2 && { category: tagSplit[0] }),
        };
      }

      const hasTag = fic.tags?.find(
        (t) => t.name === tag.name && t.category === tag.category,
      );
      if (hasTag) return;

      setFic((prev) => ({
        ...prev,
        tags: [...(prev!.tags ?? []), tag],
      }));
      addTag(tag, setTags);
    },
    [fic],
  );

  const removeTagFromFic = useCallback(
    (tag: Tag) => {
      if (!fic) return;

      const hasTag = fic.tags?.find(
        (t) => t.name === tag.name && t.category === tag.category,
      );
      if (!hasTag) return;

      setFic((prev) => ({
        ...prev,
        tags: prev!.tags!.filter(
          (t) => t.name === tag.name && t.category === tag.category,
        ),
      }));
    },
    [fic],
  );

  const fetchAO3Data = useCallback(async () => {
    if (!fic.link) return;

    const metadata = await fetchWorkMetadata(fic.link, true);

    // TODO: need to be able to create tags?
    console.log({ metadata });
    const { title, relationshipList, chaptered, wordcount, rating, category } =
      metadata;

    // setMappedRelationships(relationshipList.map((relationship) => tagMappings[relationship] ))
    setMappedRelationships(
      relationshipList.reduce((acc: Record<string, string>, val) => {
        acc[val] = tagMappings[val] ?? val;
        return acc;
      }, {}),
    );
    setRelationshipList(relationshipList);

    const tags: Tag[] = [];
    if (chaptered) tags.push({ name: 'chaptered' });
    const hasCapitalsRegex = /[A-Z]/;
    if (!hasCapitalsRegex.test(title))
      tags.push({ name: 'lapslock', category: 'title' });
    else if (
      hasCapitalsRegex.test(title[0]) &&
      !hasCapitalsRegex.test(title.substring(0, title.length))
    )
      tags.push({ name: 'first capitalized', category: 'title' });
    // TODO: wc length buckets?
    if (wordcount < 10000) tags.push({ name: 'short', category: 'wc' });
    else if (wordcount < 50000) tags.push({ name: 'medium', category: 'wc' });
    else tags.push({ name: 'long', category: 'wc' });
    if (rating) tags.push({ name: rating, category: 'rating' });
    if (category === 'F/F') tags.push({ name: category, category: 'category' });

    setFic((prev) => ({
      ...prev,
      title,
      wordcount,
      chaptered,
      tags: [...(prev.tags ?? []), ...tags],
    }));
  }, [fic.link, tagMappings]);

  return (
    <div>
      <button onClick={() => setDialogOpen(true)}>+ Add Fic</button>
      {dialogOpen && (
        <div>
          <dialog open={dialogOpen}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* either put in title/wc info yourself or fetch it from ao3 */}
              <label htmlFor='fic-link'>AO3 link</label>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <input
                  id='fic-link'
                  type='text'
                  value={fic.link}
                  onChange={(e) =>
                    setFic((prev) => ({ ...prev, link: e.target.value }))
                  }
                />
                <button onClick={fetchAO3Data}>Fetch data from AO3</button>
              </div>
              <label htmlFor='fic-day'>Day</label>
              <input
                type='text'
                id='fic-day'
                value={fic.day ?? ''}
                onChange={(e) =>
                  setFic((prev) => ({
                    ...prev,
                    day:
                      !!e.target.value && !isNaN(parseInt(e.target.value))
                        ? parseInt(e.target.value)
                        : undefined,
                  }))
                }
              />
              <label htmlFor='fic-wc'>Wordcount</label>
              <input
                type='text'
                id='fic-wc'
                value={fic.wordcount ?? ''}
                onChange={(e) =>
                  setFic((prev) => ({
                    ...prev,
                    wordcount:
                      !!e.target.value && !isNaN(parseInt(e.target.value))
                        ? parseInt(e.target.value)
                        : undefined,
                  }))
                }
              />
              <label htmlFor='fic-title'>Title</label>
              <input
                type='text'
                id='fic-title'
                value={fic.title}
                onChange={(e) =>
                  setFic((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              {/* TODO: ability to put things in manually as well, plus mapping, etc. */}

              <h4>Relationship(s)</h4>
              {/* hmmmmm this doesnt work right for manual ones. */}
              {relationshipList.map((relationship, i) => (
                <div style={{ display: 'flex', flexDirection: 'row' }} key={i}>
                  <input
                    type='text'
                    value={mappedRelationships[relationship] ?? relationship}
                    onChange={(e) =>
                      mappedRelationships[relationship]
                        ? setMappedRelationships((prev) => ({
                            ...prev,
                            [relationship]: e.target.value,
                          }))
                        : setRelationshipList((prev) =>
                            prev.map((rel, index) =>
                              index === i ? e.target.value : rel,
                            ),
                          )
                    }
                    placeholder='Maps to'
                  />
                  <input
                    type='checkbox'
                    checked={
                      !!fic?.tags?.find(
                        (t) =>
                          t.name ===
                            (mappedRelationships[relationship] ??
                              relationship) && t.category === 'relationship',
                      )
                    }
                    onChange={(e) =>
                      e.target.checked
                        ? addTagToFic({
                            name:
                              mappedRelationships[relationship] ?? relationship,
                            category: 'relationship',
                          })
                        : removeTagFromFic({
                            name:
                              mappedRelationships[relationship] ?? relationship,
                            category: 'relationship',
                          })
                    }
                  />
                </div>
              ))}
              <button
                onClick={() => setRelationshipList((prev) => [...prev, ''])}
              >
                Add relationship
              </button>

              <label htmlFor='fic-notes'>Notes</label>
              <textarea
                id='fic-notes'
                value={fic.notes ?? ''}
                onChange={(e) =>
                  setFic((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
              <h4>Tags</h4>
              <p>{fic.tags?.map((tag) => getTagString(tag)).join(', ')}</p>
              <select
                name='fic-tag-select'
                id='fic-tag-select'
                value=''
                onChange={(e) => addTagToFic(e.target.value)}
              >
                <option value=''>Select tag</option>
                {tags.map((tag) => (
                  <option key={tag.name} value={getTagString(tag)}>
                    {getTagString(tag)}
                  </option>
                ))}
              </select>
              {/* and a button to add new tags */}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => {
                    setFic({ title: '', link: '' });
                    setDialogOpen(false);
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (fic && !!fic.link && !!fic.title) {
                      // TODO: reload tags locally?
                      console.log({ tags });
                      window?.localStorage?.setItem(
                        'author-guesser_tags',
                        JSON.stringify(tags),
                      );
                      saveMappedRelationships();
                      console.log({ fic });
                      addFicCallback(fic);
                      setFic({ title: '', link: '' });
                      setDialogOpen(false);
                    } else {
                      alert('Set fic info');
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </dialog>
        </div>
      )}
      {/* <button command='show-modal' commandfor='my-dialog'>
        Open dialog
      </button>

      <dialog id='my-dialog'>
        <p>This dialog was opened using an invoker command.</p>
        <button commandfor='my-dialog' command='close'>
          Close
        </button>
      </dialog> */}
    </div>
  );
}
