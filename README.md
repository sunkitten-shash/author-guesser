todos:

- actually test basic process
- get match linking to work properly
  - ooh it stays highlighted as long as it's working on matching? like while it's loading. there should be some sort of feedback as well, can throw in a stupid snackbar or smth
  - it should probably have a popup of certainty for the match
- check hover blocking
- put in better tag adding (try using mui autocomplete?)
- filtering
  - visual filter (mui for categories & searchable?)
  - actually filter things - just have like filteredFics/filteredAuthors memoized objects?
- viewing & editing matches & tag matches
- highlighting tag overlap
  - only on hover? generally when filtering? oooh toggleable on and off?
  - maybe figure out css brightness filters for this esp since you're working w/ color coding. or steal gsheets colors I don't care
- functionality for viewing like unmatched authors/etc
- setting wordcount for authors/filtering fics to only that wordcount or above?
- put in preliminary info?
- author archiving? author duplication across events?
- pulling in real author info? or just add it manually it's kinda fun to figure out lol
- loading state (at least for while updating things)
- hide categories of tags (e.g., rating, ship, etc.)
- consider having like rating, ship, etc. put elsewhere? since it's somewhat different info?
- double-click on fic/author to filter fics/authors to only that one (easier for clearer matching?)
- matches should be more like Matches: [name] [name] [name] color-coded to strength, a sort of toggle buttons situation where you click on one and can see info

TODO: figure out styling/css variables for shadcn csss

https://base-ui.com/react/components/combobox YESSS this looks like. wayy easier to directly use lol I can just use their styles also if needed,
