import TagFilterSelector from './TagFilterSelector';

interface FiltersProps {
  filter: GenericFilter;
  setFilter: (updatedFilter: Partial<GenericFilter>) => void;
}

export default function Filters({ filter, setFilter }: FiltersProps) {
  const { tags, operator, unmatchedOnly } = filter;

  return (
    <div className='filter-container'>
      <select
        value={operator}
        onChange={(e) =>
          setFilter({ operator: e.target.value as 'AND' | 'OR' })
        }
      >
        <option value='OR'>OR</option>
        <option value='AND'>AND</option>
      </select>
      <TagFilterSelector
        value={tags ?? []}
        setValue={(newTags) => setFilter({ tags: newTags })}
      />
      <input
        type='checkbox'
        name='unmatched-only'
        checked={unmatchedOnly}
        onChange={(e) => setFilter({ unmatchedOnly: e.target.checked })}
      />
      <label htmlFor='unmatched-only'>Unmatched only</label>
    </div>
  );
}
