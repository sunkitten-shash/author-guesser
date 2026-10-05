import useSWR from 'swr';

export const fetcher = (url: string) =>
  fetch(`/api/${url}`).then((res) => res.json());

export const useEvents = ({
  includeArchived,
}: {
  includeArchived: boolean;
}) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/events?includearchived=${includeArchived}`,
    fetcher,
  );

  return {
    events: (data ?? []) as EventRecord[],
    error,
    isLoading,
    mutate,
  };
};

export const useFics = (eventId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/events/${eventId}/fics`,
    fetcher,
  );

  return {
    fics: (data ?? []) as Fic[],
    error,
    isLoading,
    mutate,
  };
};

export const useAuthors = (eventId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/events/${eventId}/authors`,
    fetcher,
  );

  return {
    authors: (data ?? []) as Author[],
    error,
    isLoading,
    mutate,
  };
};

export const useMatches = (eventId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/events/${eventId}/matches`,
  );

  return {
    matches: (data ?? []) as FicMatch[],
    error,
    isLoading,
    mutate,
  };
};

export const useTags = () => {
  const { data, error, isLoading, mutate } = useSWR('/tags', fetcher);

  return {
    tags: (data ?? []) as Tag[],
    error,
    isLoading,
    mutate,
  };
};

export const useShipMappings = () => {
  const { data, error, isLoading } = useSWR('/shipmappings', fetcher);

  return {
    shipMappings: (data ?? {}) as Record<string, string>,
    error,
    isLoading,
  };
};
