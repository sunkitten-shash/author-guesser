import { useState, useMemo, useCallback, KeyboardEvent } from 'react';
import { useTags } from '../_lib/swrLoaders';
import { getTagString, tagsAreEqual } from '../_lib/utils';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '../components/ui/combobox';

interface TagFilterSelectorProps {
  value: Tag[];
  setValue: (newTags: Tag[]) => void;
}

interface TagGroup {
  value: string;
  items: Tag[];
}

const NO_CATEGORY_LABEL = 'No category';

export default function TagFilterSelector({
  value,
  setValue,
}: TagFilterSelectorProps) {
  const [search, setSearch] = useState('');

  const anchor = useComboboxAnchor();

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

  const { groups, tagDict, groupedTags } = useMemo(() => {
    const uniqueCategories = new Set(
      searchedTags.map((tag) => tag.category ?? NO_CATEGORY_LABEL),
    );
    const sortedCategories = Array.from(uniqueCategories).sort((a, b) =>
      a.localeCompare(b),
    );
    const groupedTags = sortedCategories.reduce((acc: TagGroup[], category) => {
      acc.push({
        value: category,
        items: searchedTags.filter((tag) =>
          category === NO_CATEGORY_LABEL
            ? !tag.category
            : tag.category === category,
        ),
      });
      return acc;
    }, []);
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
    return { groups: sortedCategories, tagDict, groupedTags };
  }, [searchedTags]);

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;

      const trimmed = search.trim();
      if (!trimmed) return;

      const existingTag = tags.find((tag) => getTagString(tag) === trimmed);
      if (existingTag) {
        setSearch('');
        if (!value.find((tag) => tagsAreEqual(existingTag, tag)))
          setValue([...value, existingTag]);
      }
    },
    [search, setValue, tags, value],
  );

  return (
    <Combobox
      aria-label='Tags'
      value={value}
      multiple
      onValueChange={(newTags) => {
        console.log({ newTags });
        setValue(newTags);
      }}
      inputValue={search}
      onInputValueChange={setSearch}
      // items={tags}
      items={groupedTags}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(values: Tag[]) => (
            <>
              {values.map((tag) => (
                <ComboboxChip key={getTagString(tag)}>
                  {getTagString(tag)}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder='Search...'
                id='tag-filter-selector'
                onKeyDown={(e) => handleInputKeyDown(e)}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      {/* <label htmlFor='tag-filter-selector'>Tags</label> */}

      <ComboboxContent style={{ backgroundColor: 'black' }}>
        <ComboboxList>
          {(group: TagGroup, index) => (
            <ComboboxGroup key={index} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(item: Tag, i) => (
                  <ComboboxItem key={i} value={item}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
          {/* {groups.map((category, i) => (
            <ComboboxGroup key={i} id={category}>
              <ComboboxLabel>{category}</ComboboxLabel>
              {tagDict[category]?.map((tag, i) => (
                <ComboboxItem key={i} value={tag}>
                  {tag.name}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          ))} */}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
