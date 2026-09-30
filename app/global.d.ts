interface Tag {
  name: string;
  category?: string;
}

interface Fic {
  title: string;
  link: string;
  day?: number;
  week?: number;
  // TODO: make sure newlines get recorded accurately?
  notes?: string;
  wordcount?: number;
  tags?: Tag[];
  realAuthor?: Author;
  correct?: boolean;
  matches?: FicMatch[];
}

interface FicMetadata {
  title: string;
  rating: string;
  category: string;
  relationshipList: string[];
  wordcount: number;
  chapterCount: number;
  chaptered: boolean;
}

interface Author {
  name: string;
  link?: string;
  hasValidLink?: boolean;
  twitter?: string;
  notes?: string;
  tags?: Tag[];
  day?: number;
  week?: number;
  number?: number;
}

interface TagMatch {
  tagName: string;
  // TODO: consider enum
  strength?: string;
  // TODO: do these as a tooltip?
  notes?: string;
}

interface FicMatch {
  // TODO: should these like auto-update? or button to update them.....?
  matchingTags?: TagMatch[];
  strength?: string;
  notes?: string;
}

interface FicMatchRecord {
  [ficNameAuthorName: string]: FicMatch[];
}

interface EventRecord {
  fics?: Fic[];
  authors?: Author[];
  matches?: FicMatchRecord;
}
