import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"

interface ComboBoxResponsiveProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  filter?: (value: string, search: string) => number;
}

export function ComboBoxResponsive({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyPlaceholder = "No options found.",
  filter,
}: ComboBoxResponsiveProps) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const selectedOption = options.find((option) => option.value === value)

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedOption ? <>{selectedOption.label}</> : <>{placeholder}</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <ComboBox
              options={options}
              selected_value={value}
              onChange={onChange}
              onOpenChange={setOpen}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              emptyPlaceholder={emptyPlaceholder}
              filter={filter}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <ComboBox
          options={options}
          selected_value={value}
          onChange={onChange}
          onOpenChange={setOpen}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyPlaceholder={emptyPlaceholder}
          filter={filter}
        />
      </PopoverContent>
    </Popover>
  )
}

interface ComboboxProps {
  options: { label: string; value: string }[];
  placeholder: string;
  searchPlaceholder: string;
  emptyPlaceholder: string;
  selected_value: string;
  onChange: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  filter?: (value: string, search: string) => number;
}

function ComboBox({
  options,
  placeholder,
  searchPlaceholder,
  emptyPlaceholder,
  selected_value,
  onChange,
  onOpenChange,
  filter,
}: ComboboxProps) {
  const normalizePhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const defaultFilter = (value: string, search: string) => {
    const lowerCaseValue = value.toLowerCase();
    const lowerCaseSearch = search.toLowerCase();

    // Check if the value (which includes name and phone) contains the search term
    if (lowerCaseValue.includes(lowerCaseSearch)) {
      return 1;
    }

    // Extract phone number from value and check for startsWith
    const phoneMatch = value.match(/\d+/g);
    const phoneNumber = phoneMatch ? phoneMatch.join('') : '';
    const normalizedSearch = search.replace(/\D/g, '');

    if (phoneNumber.startsWith(normalizedSearch)) {
      return 1;
    }

    return 0;
  };

  return (
    <Command filter={filter || defaultFilter}>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.label}
              onSelect={(currentValue) => {
                const optionValue = options.find(opt => opt.label.toLowerCase() === currentValue.toLowerCase())?.value || ""
                onChange(optionValue === selected_value ? "" : optionValue)
                if (onOpenChange) {
                  onOpenChange(false)
                }
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selected_value === option.value ? "opacity-100" : "opacity-0"
                )}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
