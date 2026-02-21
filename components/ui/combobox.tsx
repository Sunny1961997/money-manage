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
  contentClassName?: string
  showCheckIcon?: boolean
  roundedItems?: boolean
  matchTriggerWidth?: boolean
  disabled?: boolean
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
  contentClassName,
  showCheckIcon = true,
  roundedItems = false,
  matchTriggerWidth = false,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (disabled && open) {
      setOpen(false)
    }
  }, [disabled, open])

  // For multi-select, value is string[]
  const isMulti = multiple
  const selectedValues = isMulti
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' ? value : "")

  const singleSelectedValue = typeof selectedValues === "string" ? selectedValues.trim() : ""
  const singleSelectedOption = !isMulti && singleSelectedValue
    ? options.find((option) => option.value === singleSelectedValue)
    : undefined
  const singleDisplayText = singleSelectedOption?.label ?? (singleSelectedValue || placeholder)
  const hasSingleSelection = Boolean(singleSelectedOption || singleSelectedValue)

  const multiSelectedLabels = isMulti
    ? options
        .filter((option) => Array.isArray(selectedValues) && selectedValues.includes(option.value))
        .map((option) => option.label)
    : []
  const multiDisplayText = multiSelectedLabels.length > 0 ? multiSelectedLabels.join(", ") : placeholder
  const hasMultiSelection = multiSelectedLabels.length > 0

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
          disabled={disabled}
          className={cn(
            "w-full justify-between disabled:cursor-not-allowed disabled:opacity-100 disabled:border-border/80 disabled:bg-muted/60 disabled:text-muted-foreground disabled:hover:bg-muted/60 disabled:hover:text-muted-foreground",
            className
          )}
        >
          <span
            className={cn(
              "truncate text-left",
              isMulti ? !hasMultiSelection && "text-muted-foreground" : !hasSingleSelection && "text-muted-foreground"
            )}
          >
            {isMulti ? multiDisplayText : singleDisplayText}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          matchTriggerWidth ? "w-[var(--radix-popover-trigger-width)] p-0" : "w-full p-0",
          contentClassName
        )}
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup className={roundedItems ? "p-1" : undefined}>
              {options.map((option, index) => (
                <CommandItem
                  // Combining value and index ensures the key is always unique 
                  // even if the data contains duplicate values like '+61'
                  key={`${option.value}-${index}`}
                  // Use a unique internal command value to avoid duplicate highlight state
                  // when labels repeat (e.g., customers with same name).
                  value={`${option.label} ${option.value}`}
                  onSelect={() => handleSelect(option.value)}
                  className={roundedItems ? "rounded-md" : undefined}
                >
                  {showCheckIcon && (
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
                  )}
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
