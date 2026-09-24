interface Tag {
  name: string;
  category?: string;
}

interface Fic {
  title: string;
  link?: string;
  day?: number;
  // TODO: make sure newlines get recorded accurately?
  notes: string;
  wordcount?: number;
  tags?: Tag[];
  realAuthor?: Author;
  correct?: boolean;
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
  notes: string;
  tags?: Tag[];
  number?: number;
}

interface TagMatch {
  tagName: string;
  // TODO: consider enum
  strength?: string;
  // TODO: do these as a tooltip?
  notes?: string;
}

interface FicMatchRecord {
  [ficNameAuthorName: string]: {
    // TODO: should these like auto-update? or button to update them.....?
    matchingTags?: TagMatch[];
    strength?: string;
    notes?: string;
  };
}

interface EventRecord {
  fics?: Fic[];
  authors?: Author[];
  matches?: Match[];
}
