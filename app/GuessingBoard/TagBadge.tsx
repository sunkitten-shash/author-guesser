import { getTagString } from '../_lib/utils';

interface TagBadgeProps {
  tag: Tag;
}

export default function TagBadge({ tag }: TagBadgeProps) {
  return <span className='tagBadge'>{getTagString(tag)}</span>;
}
