import styles from './styles.module.css';
import { useState } from 'react';
import { Popover } from '../popover';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { ChevronDown, XIcon } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../input-group';

interface ComboBoxProps<T> {
  value: T[];
  onChange: (event: any, value: T[]) => void;
  options: T[];
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  groupBy?: (value: T) => string;
}

// export default function ComboBox<T>({
//   value,
//   onChange,
//   options,
//   getOptionLabel,
//   isOptionEqualToValue,
//   groupBy,
// }: ComboBoxProps<T>) {
//   const [open, setOpen] = useState(false);

//   <Popover open={open} onOpenChange={setOpen}></Popover>;
// }

const Combobox = ComboboxPrimitive.Root;

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot='combobox-value' {...props} />;
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot='combobox-trigger'
      className={className}
      {...props}
    >
      {children}
      <ChevronDown />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot='combobox-clear'
      // render={<InputGroupButton variant='ghost' size='icon-xs' />}
      render={<InputGroupButton variant='ghost' size='icon-xs' />}
      className={className}
      {...props}
    >
      <XIcon />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  return (
    <InputGroup style={{ width: 'auto' }}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align='inline-end'>
        {/* className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent" */}
        {showTrigger && (
          <InputGroupButton
            size='icon-xs'
            variant='ghost'
            render={<ComboboxTrigger />}
            data-slot='input-group-button'
            disabled={disabled}
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    'side' | 'align' | 'sideOffset' | 'alignOffset' | 'anchor'
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className={styles['combobox-primitive-positioner']}
      >
        <ComboboxPrimitive.Popup
          data-slot='combobox-content'
          data-chips={!!anchor}
          className={`${styles['combobox-primitive-popup']} ${className ?? ''}`}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}
