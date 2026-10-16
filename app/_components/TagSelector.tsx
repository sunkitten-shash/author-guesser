import { useMemo, useState } from 'react';
import { useTags } from '../_lib/swrLoaders';
import { getTagString, tagsAreEqual } from '../_lib/utils';
import { Combobox } from '@base-ui/react';

interface TagSelectorProps {
  value: Tag[];
  setValue: (tags: Tag[]) => void;
}

const NO_CATEGORY_LABEL = 'No category';

export default function TagSelector({ value, setValue }: TagSelectorProps) {
  const [search, setSearch] = useState('');

  const { tags, isLoading, mutate } = useTags();

  const { groups, tagDict } = useMemo(() => {
    const uniqueCategories = new Set(
      tags.map((tag) => tag.category ?? NO_CATEGORY_LABEL),
    );
    const sortedCategories = Array.from(uniqueCategories).sort((a, b) =>
      a.localeCompare(b),
    );
    const tagDict = sortedCategories.reduce(
      (acc: Record<string, Tag[]>, category) => {
        let tagsList = [];
        if (category === NO_CATEGORY_LABEL)
          tagsList = tags.filter((tag) => !tag.category);
        else tagsList = tags.filter((tag) => tag.category === category);
        acc[category] = tagsList.filter(
          (tag) => !value.find((t) => tagsAreEqual(tag, t)),
        );
        return acc;
      },
      {},
    );
    return { groups: sortedCategories, tagDict };
  }, [tags, value]);

  return (
    <>
      <Combobox.Root
        items={tags}
        onValueChange={(value) => {
          console.log({ value });

          /*
                const creatableSelection = next.find(             (item) => item.creatable && !selected.some((current) => current.id === item.id),           );
          if (creatableSelection && creatableSelection.creatable) {             pendingQueryRef.current = creatableSelection.creatable;             setOpenDialog(true);             return;           }           const clean = next.filter((i) => !i.creatable);           setSelected(clean);           setQuery('');
      */
        }}
        inputValue={search}
        onInputValueChange={setSearch}
      >
        <div>
          <label htmlFor='tag-selector'>Tags</label>
          {/* also has a ref */}
          <Combobox.Input
            id='tag-selector'
            placeholder='Search or create tag'
            onKeyDown={() => console.log('handle input key down')}
          />
        </div>

        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4}>
            <Combobox.Popup
              style={{
                backgroundColor: 'black',
              }}
            >
              <Combobox.Empty>
                <span>No tags found</span>
              </Combobox.Empty>

              <Combobox.List>
                {groups.map((category, i) => (
                  <Combobox.Group
                    key={i}
                    items={tagDict[category]}
                    id={category}
                  >
                    <Combobox.GroupLabel>{category}</Combobox.GroupLabel>
                    <Combobox.Collection>
                      {(tag: Tag) => (
                        <Combobox.Item
                          key={getTagString(tag)}
                          value={getTagString(tag)}
                        >
                          {tag.name}
                        </Combobox.Item>
                      )}
                    </Combobox.Collection>
                  </Combobox.Group>
                ))}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </>
  );
}
