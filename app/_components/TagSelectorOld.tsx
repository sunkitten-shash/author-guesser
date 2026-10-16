// hmmm I don't actually need multiple....they can be listed separately

import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTags } from '../_lib/swrLoaders';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from '../components/ui/combobox';
import { getTagString, stringToTag, tagsAreEqual } from '../_lib/utils';
import { addTag } from '../_lib/updaters';

// in fact prob SHOULD be
interface TagSelectorProps {
  value: Tag[];
  addTagCallback: (tag: Tag) => void;
}

// ok so it's currently rendering just. transparent. also the dialog is wayyy off to the side i should probably use shadcn dialog or smth
// possibly just use unstyled base ui autocomplete/combobox
// bc I don't need it to show other values just filter those out
// and it should be possible to search within it and add a new one
// like my tag select for the podfic db!! i am soooo tempted to just plop material ui in bc i KNOW how to do that,,
const NO_CATEGORY_LABEL = 'No category';

export default function TagSelectorOld({
  value,
  addTagCallback,
}: TagSelectorProps) {
  const [search, setSearch] = useState('');

  const { tags, isLoading, mutate } = useTags();

  const filteredTags = useMemo(
    () => tags.filter((tag) => !value.find((t) => tagsAreEqual(tag, t))),
    [tags, value],
  );

  const searchedTags = useMemo(() => {
    let searched = filteredTags;
    let searchTerm = search.toLowerCase();
    let category = '';
    if (searchTerm.includes(':')) {
      category = searchTerm.split(':')[0];
      searchTerm = searchTerm.split(':')[1];
    }
    if (category) {
      searched = searched.filter((tag) => tag.category === category);
      searched = searched.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm),
      );
    } else {
      searched = searched.filter((tag) =>
        getTagString(tag).toLowerCase().includes(searchTerm),
      );
    }
    return searched;
  }, [filteredTags, search]);

  const { groups, tagDict } = useMemo(() => {
    const uniqueCategories = new Set(
      searchedTags.map((tag) => tag.category ?? NO_CATEGORY_LABEL),
    );
    const sortedCategories = Array.from(uniqueCategories).sort((a, b) =>
      a.localeCompare(b),
    );
    const tagDict = sortedCategories.reduce(
      (acc: Record<string, Tag[]>, category) => {
        if (category === NO_CATEGORY_LABEL)
          acc[category] = searchedTags.filter((tag) => !tag.category);
        else
          acc[category] = searchedTags.filter(
            (tag) => tag.category === category,
          );
        return acc;
      },
      {},
    );
    return { groups: sortedCategories, tagDict };
  }, [searchedTags]);

  const exactMatch = useMemo(
    () => filteredTags.find((tag) => getTagString(tag) === search),
    [filteredTags, search],
  );

  const handleCreate = useCallback(
    async (value: string) => {
      // const input = createInputRef || comboboxInputRef;
      // const value = input?.current?.value?.trim() ?? '';
      // if (!value) {
      //   return;
      // }
      if (!value) return;

      const newTag = stringToTag(value);

      const tagId = await addTag(newTag);
      newTag.tag_id = tagId;

      await mutate();
      addTagCallback(newTag);
    },
    [addTagCallback, mutate],
  );

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;

      const trimmed = search.trim();
      if (!trimmed) return;

      const existingTag = tags.find((tag) => getTagString(tag) === trimmed);
      if (existingTag) {
        setSearch('');
        if (!value.find((tag) => tagsAreEqual(existingTag, tag))) {
          addTagCallback(existingTag);
        }
      } else {
        handleCreate(trimmed);
      }
    },
    [addTagCallback, handleCreate, search, tags, value],
  );

  return (
    <Combobox
      aria-label='Tags'
      value={null}
      onValueChange={(newValue: Tag | null) => {
        if (newValue) {
          if (newValue.name === 'newtag') handleCreate(search.trim());
          else addTagCallback(newValue);
        }
      }}
      inputValue={search}
      onInputValueChange={setSearch}
    >
      <label htmlFor='tag-selector'>Tags</label>
      <ComboboxInput
        placeholder='Search or create tag'
        id='tag-selector'
        onKeyDown={(e) => handleInputKeyDown(e)}
      />
      <ComboboxContent style={{ backgroundColor: 'black' }}>
        {/* <ComboboxList renderEmptyState={() => <ComboboxEmpty>No tags.</ComboboxEmpty>} */}
        <ComboboxList>
          {!!search && !exactMatch && (
            <ComboboxItem
              value={{ name: 'newtag' }}
            >{`Create ${search}`}</ComboboxItem>
          )}
          {groups.map((category, i) => (
            <ComboboxGroup key={i} id={category}>
              <ComboboxLabel>{category}</ComboboxLabel>
              {tagDict[category]?.map((tag, i) => (
                <ComboboxItem key={i} value={tag}>
                  {tag.name}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

/*
export function ComboboxWithGroupsAndSeparator() {
  return (
    <Combobox allowsEmptyCollection aria-label='Timezone'>
      <ComboboxInput placeholder='Select a timezone' />
      <ComboboxContent>
        <ComboboxList
          renderEmptyState={() => (
            <ComboboxEmpty>No timezones found.</ComboboxEmpty>
          )}
        >
          {timezones.map((group, index) => (
            <ComboboxGroup key={group.value} id={group.value}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              {group.items.map((item) => (
                <ComboboxItem key={item} id={item}>
                  {item}
                </ComboboxItem>
              ))}
              {index < timezones.length - 1 && <ComboboxSeparator />}
            </ComboboxGroup>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
*/
