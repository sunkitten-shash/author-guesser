import { useCallback, useEffect, useState } from 'react';
import { fetchWorkMetadata } from '../_lib/ao3Utils';
import { getTagString, setAsNum } from '../_lib/utils';
import { useShipMappings, useTags } from '../_lib/swrLoaders';
import { addFic, addTag, updateShipMappings } from '../_lib/updaters';
import TagSelector from '../_components/TagSelector';
import TagSelectorOld from '../_components/TagSelectorOld';

interface FicAddProps {
  eventId: string | number;
  addFicCallback: () => Promise<void>;
}

export default function FicAdd({ eventId, addFicCallback }: FicAddProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fic, setFic] = useState<Fic>({ title: '', link: '' });

  const { shipMappings, isLoading: shipMappingsLoading } = useShipMappings();
  const [localShipMappings, setLocalShipMappings] = useState<
    Record<string, string>
  >({});
  const [relationshipList, setRelationshipList] = useState<string[]>([]);

  const { tags, mutate: mutateTags } = useTags();

  useEffect(() => {
    if (!shipMappingsLoading) {
      setLocalShipMappings(shipMappings);
    }
  }, [shipMappings, shipMappingsLoading]);

  const addTagToFic = useCallback(
    async (tag: Tag | string) => {
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

      const existingTag = tags.find(
        (t) =>
          (!!tag.tag_id && tag.tag_id === t.tag_id) ||
          (tag.name === t.name && tag.category === t.category),
      );
      if (existingTag) {
        tag.tag_id = existingTag.tag_id;
      } else {
        const tagId = await addTag(tag);
        tag.tag_id = tagId;
        mutateTags();
      }

      setFic((prev) => ({
        ...prev,
        tags: [...(prev!.tags ?? []), tag],
      }));
    },
    [fic.tags, mutateTags, tags],
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

    console.log({ metadata });
    const { title, relationshipList, chaptered, wordcount, rating, category } =
      metadata;

    // TODO: is this circular. I changed the logic and this might not be needed anymore.
    setLocalShipMappings(
      relationshipList.reduce((acc: Record<string, string>, val) => {
        acc[val] = localShipMappings[val] ?? val;
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
  }, [fic.link, localShipMappings]);

  return (
    <div>
      <button onClick={() => setDialogOpen(true)}>+ Add Fic</button>
      {dialogOpen && (
        <div>
          <dialog
            open={dialogOpen}
            style={{
              position: 'absolute',
              left: '25%',
              right: '25%',
              top: '15%',
              width: '50%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '5px',
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
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label htmlFor='fic-week'>Week</label>
                <input
                  id='fic-week'
                  type='text'
                  value={fic.week ?? ''}
                  onChange={(e) =>
                    setFic((prev) => ({
                      ...prev,
                      week: setAsNum(e.target.value),
                    }))
                  }
                />
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
              </div>

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
                    value={localShipMappings[relationship] ?? relationship}
                    onChange={(e) =>
                      localShipMappings[relationship]
                        ? setLocalShipMappings((prev) => ({
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
                            (localShipMappings[relationship] ?? relationship) &&
                          t.category === 'ship',
                      )
                    }
                    onChange={(e) =>
                      e.target.checked
                        ? addTagToFic({
                            name:
                              localShipMappings[relationship] ?? relationship,
                            category: 'ship',
                          })
                        : removeTagFromFic({
                            name:
                              localShipMappings[relationship] ?? relationship,
                            category: 'ship',
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
                  <option key={getTagString(tag)} value={getTagString(tag)}>
                    {getTagString(tag)}
                  </option>
                ))}
              </select>
              {/* and a button to add new tags */}
              <TagSelector
                value={fic.tags ?? []}
                setValue={(newTags) =>
                  setFic((prev) => ({ ...prev, tags: newTags }))
                }
              />
              <TagSelectorOld
                value={fic.tags ?? []}
                // setValue={() => console.log('set value')}
                addTagCallback={(newTag) =>
                  setFic((prev) => ({
                    ...prev,
                    tags: [...(prev.tags ?? []), newTag],
                  }))
                }
              />

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
                  onClick={async () => {
                    if (fic && !!fic.link && !!fic.title) {
                      await updateShipMappings(localShipMappings);
                      console.log({ fic });
                      await addFic({ ...fic, event_id: eventId });
                      await addFicCallback();
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
