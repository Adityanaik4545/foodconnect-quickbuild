import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectOption({value, onChange}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Reason" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Why you want to restrict this user</SelectLabel>
  <SelectItem value="spam / Fake account">Spam / Fake account</SelectItem>
  <SelectItem value="policy violation">Policy violation</SelectItem>
  <SelectItem value="Misuse of platform">Misuse of platform</SelectItem>
  <SelectItem value="inactive account">Inactive account</SelectItem>
  <SelectItem value="appealed for account removal">User requested deletion</SelectItem>
  <SelectItem value="other">Other</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
