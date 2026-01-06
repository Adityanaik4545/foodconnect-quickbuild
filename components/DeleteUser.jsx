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
import { SelectOption } from "./SelectOption"
import { restrictUserByAdmin } from "@/app/actions/admin"

export function DeleteUser({open, onOpenChange, user, onSuccess}) {
  const [reason, setReason] = React.useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)")

  React.useEffect(() => {
  if (!open) setReason("");
}, [open]);


    const content = (
    <DeleteUserForm
      reason={reason}
      setReason={setReason}
      user={user}
      onClose={() => onOpenChange(false)}
      onSuccess={onSuccess}
      className="px-4"
    />
  );

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
          {content}
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
        {content}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DeleteUserForm({ reason, setReason, user, onClose, className, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);


    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason) return;

    setIsSubmitting(true);

try {
  console.log("restricting user:", user.userId, reason);
      await restrictUserByAdmin(user.userId, reason);
      onSuccess(user.userId);
      onClose();
} catch (error) {
  console.error("failed to restrict user:", error);
  alert("failed to restrict user. please try again.")
} finally {
  setIsSubmitting(false);
}
  };
  return (
    <form onSubmit={handleSubmit} className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <SelectOption value={reason} onChange={setReason} />
      </div>
      <Button type="submit" variant="destructive" disabled={!reason || isSubmitting}>{isSubmitting ? "Restricting..." : "Confirm Restriction"}</Button>
    </form>
  )
}
