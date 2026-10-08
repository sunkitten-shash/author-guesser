import { useEffect, useState } from 'react';
import { getTagString } from '../_lib/utils';

interface TagBadgeProps {
  tag: Tag;
  showDropdown?: boolean;
}

export default function TagBadge({ tag, showDropdown = false }: TagBadgeProps) {
  // TODO: is a callback needed for this?
  const [selected, setSelected] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (selected) setDropdownOpen(true);
  }, [selected]);

  return (
    <div>
      <span
        className={`badge ${selected ? 'selected' : ''}`}
        onClick={() => setSelected((prev) => !prev)}
      >
        {getTagString(tag)}
      </span>
      {selected && showDropdown && <span>heemo time</span>}
    </div>
  );
}
