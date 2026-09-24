import { useCallback, useState } from 'react';
import { fetchWorkMetadata } from '../ao3Utils';
import { getParsed } from '../utils';

interface FicAddProps {
  addFicCallback: (fic: Fic) => void;
}

export default function FicAdd({ addFicCallback }: FicAddProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fic, setFic] = useState<Fic | null>(null);
  const [link, setLink] = useState('');

  const [tagMappings, setTagMappings] = useState<Record<string, string>>(
    getParsed(`author-guesser_tagMappings`, {}),
  );
  const [mappedRelationships, setMappedRelationships] = useState<
    Record<string, string>
  >({});
  const [relationshipList, setRelationshipList] = useState<string[]>([]);

  const addTagToFic = useCallback(
    (tag: Tag) => {
      if (!fic) return;

      const hasTag = fic.tags?.find(
        (t) => t.name === tag.name && t.category === tag.category,
      );
      if (hasTag) return;

      setFic((prev) => ({
        ...prev,
        title: prev!.title ?? '',
        notes: prev!.notes ?? '',
        tags: [...(prev!.tags ?? []), tag],
      }));
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
        title: prev!.title ?? '',
        notes: prev!.notes ?? '',
        tags: prev!.tags!.filter(
          (t) => t.name === tag.name && t.category === tag.category,
        ),
      }));
    },
    [fic],
  );

  const fetchAO3Data = useCallback(async () => {
    if (!link) return;

    const metadata = await fetchWorkMetadata(link, true);

    // TODO: need to be able to create tags?
    console.log({ metadata });
    const { title, relationshipList, chaptered, wordcount } = metadata;

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

    setFic({
      title: title,
      notes: '',
      link,
      wordcount,
      tags,
    });
  }, [link, tagMappings]);

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
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <button onClick={fetchAO3Data}>Fetch data from AO3</button>
              </div>
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
              // and a button to add another relationship
              <button
                onClick={() => setRelationshipList((prev) => [...prev, ''])}
              >
                Add relationship
              </button>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <button onClick={() => setDialogOpen(false)}>Close</button>
                <button
                  onClick={() => {
                    if (fic) {
                      addFicCallback(fic);
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
