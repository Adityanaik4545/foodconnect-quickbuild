"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectOption } from "./SelectOption"

export function DeleteUser({open, onOpenChange, user}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {/* <Button variant="destructive">Restrict</Button> */}
        </DialogTrigger>
        <DialogContent className="lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Restrict {user?.name}</DialogTitle>
            <DialogDescription>
               You are about to restrict <strong>{user?.email}</strong>. please select a reason
            </DialogDescription>
          </DialogHeader>
          <DeleteUserForm className="px-4" />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline">Restrict</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Restrict user</DrawerTitle>
          <DrawerDescription>
              Specify you reason for restricting this user account.
          </DrawerDescription>
        </DrawerHeader>
        <DeleteUserForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DeleteUserForm({ className }) {
  return (
    <form className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <SelectOption/>
      </div>
      <Button type="submit">Confirm Restriction</Button>
    </form>
  )
}
