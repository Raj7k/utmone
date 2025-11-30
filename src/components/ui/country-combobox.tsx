import * as React from "react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { countries } from "@/lib/countryData"

interface CountryComboboxProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  excludedCountries?: string[]
}

export function CountryCombobox({ value, onChange, disabled, excludedCountries = [] }: CountryComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const availableCountries = countries.filter(c => !excludedCountries.includes(c.code));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between pl-3 font-normal bg-white hover:bg-muted/50 border-border"
        >
          {value ? (
            <span className="flex items-center gap-2 truncate">
              <span className="text-muted-foreground text-xs font-mono">{value}</span>
              {countries.find((country) => country.code === value)?.name}
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" /> Select country...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {availableCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={country.name}
                  onSelect={(currentValue) => {
                    const selectedCode = countries.find(
                      (c) => c.name.toLowerCase() === currentValue.toLowerCase()
                    )?.code
                    onChange(selectedCode || "")
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{country.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
