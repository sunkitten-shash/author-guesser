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

export const setAsNumArray = (value: string) => {
  let array = value.split(',').map((val) => setAsNum(val.trim()));
  array = array.filter(Boolean);
  return array as number[];
};

// return - for a first, + for b first, 0 for equal
export const tagSort = (a: Tag, b: Tag) => {
  // uncategorized tags get returned first
  if (!a.category && !!b.category) return -1;
  else if (!!a.category && !b.category) return 1;
  else if (!a.category && !b.category) return a.name.localeCompare(b.name);

  // TODO: category ordering?

  if (a.category === b.category) {
    if (a.name === 'mixed') return -1;
    else if (b.name === 'mixed') return 1;

    return a.name.localeCompare(b.name);
  }

  return getTagString(a).localeCompare(getTagString(b));
};
