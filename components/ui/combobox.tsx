"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  multiple?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  multiple = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // For multi-select, value is string[]
  const isMulti = multiple
  const selectedValues = isMulti
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' ? value : "")

  const handleSelect = (currentValue: string) => {
    if (isMulti) {
      let newValues: string[]
      if (Array.isArray(selectedValues) && selectedValues.includes(currentValue)) {
        newValues = selectedValues.filter((v: string) => v !== currentValue)
      } else if (Array.isArray(selectedValues)) {
        newValues = [...selectedValues, currentValue]
      } else {
        newValues = [currentValue]
      }
      onValueChange?.(newValues)
    } else {
      onValueChange?.(currentValue === selectedValues ? "" : currentValue)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {isMulti
            ? (selectedValues.length > 0
                ? options.filter(option => selectedValues.includes(option.value)).map(option => option.label).join(", ")
                : placeholder)
            : (selectedValues
                ? options.find(option => option.value === selectedValues)?.label
                : placeholder)
          }
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
                {options.map((option, index) => (
                  <CommandItem
                    // Combining value and index ensures the key is always unique 
                    // even if the data contains duplicate values like '+61'
                    key={`${option.value}-${index}`} 
                    value={option.label} // Command component uses 'value' for internal search filtering
                    onSelect={() => handleSelect(option.value)}
                  >
                    <Check className={cn(
                      "mr-2 h-4 w-4",
                      isMulti
                        ? (Array.isArray(selectedValues) && selectedValues.includes(option.value))
                          ? "opacity-100"
                          : "opacity-0"
                        : selectedValues === option.value
                          ? "opacity-100"
                          : "opacity-0"
                    )} />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
