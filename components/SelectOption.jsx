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

export function SelectOption() {
  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Reason" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Why you want to restrict this user</SelectLabel>
  <SelectItem value="spam">Spam / Fake account</SelectItem>
  <SelectItem value="policy">Policy violation</SelectItem>
  <SelectItem value="misuse">Misuse of platform</SelectItem>
  <SelectItem value="inactive">Inactive account</SelectItem>
  <SelectItem value="request">User requested deletion</SelectItem>
  <SelectItem value="other">Other</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
