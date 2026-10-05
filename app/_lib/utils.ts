export const getTagString = (tag: Tag) => {
  return `${tag.category ? `${tag.category}:` : ''}${tag.name}`;
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
