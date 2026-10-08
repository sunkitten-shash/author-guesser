interface Tag {
  tag_id?: number;
  name: string;
  category?: string;
}

interface Fic {
  fic_id?: number;
  event_id?: number | string;
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
  author_id?: number;
  event_id?: number | string;
  name: string;
  link?: string;
  hasValidLink?: boolean;
  twitter?: string;
  notes?: string;
  tags?: Tag[];
  day?: number;
  week?: number;
  wordcount?: number;
  number?: number;
}

interface TagMatch {
  // tagName: string;
  tag: Tag;
  // TODO: consider enum
  strength?: string;
  // TODO: do these as a tooltip?
  notes?: string;
}

interface FicMatch {
  fic_id: number;
  author_id?: number;
  // TODO: should these like auto-update? or button to update them.....?
  matchingTags?: TagMatch[];
  strength?: string;
  notes?: string;
  archived?: boolean;
}
// TODO: needs fic, author, AND event id

interface FicMatchRecord {
  [ficNameAuthorName: string]: FicMatch[];
}

// interface EventRecord {
//   fics?: Fic[];
//   authors?: Author[];
//   matches?: FicMatchRecord;
// }

interface EventRecord {
  event_id?: string;
  name: string;
  link: string;
  archived?: boolean;
}

enum Confidence {
  CERTAIN = 'certain',
  FAIRLY_SURE = 'fairly sure',
  GOING_FOR_IT = 'going for it',
  SOLID_IDEA = 'solid idea',
  NOT_SURE = 'not sure',
}

enum Strength {
  STRONG = 'strong',
  MEDIUM = 'medium',
  WEAK = 'weak',
}
