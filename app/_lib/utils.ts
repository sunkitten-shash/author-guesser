export const getParsed = (key: string, fallback?: unknown) => {
  return JSON.parse(
    window?.localStorage?.getItem(key) ?? JSON.stringify(fallback),
  );
};
