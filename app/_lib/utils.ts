export const getTagString = (tag: Tag) => {
  return `${tag.category ? `${tag.category}:` : ''}${tag.name}`;
};

export const stringToTag = (tagString: string): Tag => {
  const tagSplit = tagString.split(':');
  return {
    name: tagSplit[tagSplit.length - 1],
    ...(tagSplit.length === 2 && { category: tagSplit[0] }),
  };
};

// Source - https://stackoverflow.com/a/34427278
// Posted by vitaly-t, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-04, License - CC BY-SA 4.0

// generic singleton creator:
export function createSingleton<T>(name: string, create: () => T): T {
  const s = Symbol.for(name);
  let scope = (global as any)[s];
  if (!scope) {
    scope = { ...create() };
    (global as any)[s] = scope;
  }
  return scope;
}

export const getTagOverlap = (tags1: Tag[], tags2: Tag[]): number[] => {
  const tags1Ids = tags1.map((tag) => tag.tag_id!).filter(Boolean);
  const tags2Ids = tags2.map((tag) => tag.tag_id!).filter(Boolean);
  return tags1Ids.filter((tag) => tags2Ids.includes(tag));
};

export const tagsAreEqual = (tag1: Tag, tag2: Tag) => {
  return (
    (!!tag1.tag_id && !!tag2.tag_id && tag1.tag_id === tag2.tag_id) ||
    (tag1.name === tag2.name && tag1.category === tag2.category)
  );
};

export const setAsNum = (value: string) => {
  return !!value && !isNaN(parseInt(value)) ? parseInt(value) : undefined;
};
