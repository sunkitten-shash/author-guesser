import { Dispatch, SetStateAction } from 'react';

export const getParsed = (key: string, fallback?: unknown) => {
  return JSON.parse(
    window?.localStorage?.getItem(key) ?? JSON.stringify(fallback),
  );
};

export const addTag = (
  newTag: Tag,
  setExistingTags: Dispatch<SetStateAction<Tag[]>>,
) => {
  setExistingTags((prev) =>
    prev.find(
      (tag) => tag.name === newTag.name && tag.category === newTag.category,
    )
      ? prev
      : [...prev, newTag],
  );
};

export const getTagString = (tag: Tag) => {
  return `${tag.category ? `${tag.category}:` : ''}${tag.name}`;
};
