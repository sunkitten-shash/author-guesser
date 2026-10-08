import { ReactNode } from 'react';

interface HoverBlockerProps {
  setChildHover: (hover: boolean) => void;
  children: ReactNode;
}

export default function HoverBlocker({
  setChildHover,
  children,
}: HoverBlockerProps) {
  return (
    <div
      onMouseEnter={() => setChildHover(true)}
      onMouseLeave={() => setChildHover(false)}
    >
      {children}
    </div>
  );
}
