import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useTags } from '../_lib/swrLoaders';
import { addTag } from '../_lib/updaters';
import { getTagString, setAsNum } from '../_lib/utils';
import TagSelectorOld from '../_components/TagSelectorOld';

interface AuthorFormProps {
  author: Author;
  setAuthor: Dispatch<SetStateAction<Author>>;
}

export default function AuthorForm({ author, setAuthor }: AuthorFormProps) {
  const [newTag, setNewTag] = useState('');

  const { tags, mutate: mutateTags } = useTags();

  const addTagToAuthor = useCallback(
    async (tag: Tag | string) => {
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

      setAuthor((prev) => ({
        ...prev,
        tags: [...(prev.tags ?? []), tag],
      }));
    },
    [author.tags, mutateTags, setAuthor, tags],
  );

  return (
    <div>
      <div
        style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}
      >
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
          value={author.link ?? ''}
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <label htmlFor='author-week'>Week</label>
          <input
            id='author-week'
            type='text'
            value={author.week ?? ''}
            onChange={(e) =>
              setAuthor((prev) => ({
                ...prev,
                week: setAsNum(e.target.value),
              }))
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
                day: setAsNum(e.target.value),
              }))
            }
          />
        </div>

        <label htmlFor='author-wordcount'>
          Wordcount (min. est., optional)
        </label>
        <input
          id='author-wordcount'
          type='text'
          value={author.wordcount ?? ''}
          onChange={(e) =>
            setAuthor((prev) => ({
              ...prev,
              wordcount: setAsNum(e.target.value),
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
        <TagSelectorOld
          value={author.tags ?? []}
          addTagCallback={(newTag) =>
            setAuthor((prev) => ({
              ...prev,
              tags: [...(prev.tags ?? []), newTag],
            }))
          }
        />
        {/* <select
          name='author-tag-select'
          id='author-tag-select'
          value=''
          onChange={(e) => addTagToAuthor(e.target.value)}
        >
          <option value=''>Select tag</option>
          {tags
            .sort((a, b) => getTagString(a).localeCompare(getTagString(b)))
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
        </button> */}
      </div>
    </div>
  );
}
