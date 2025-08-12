import * as React from "react";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface InfoDialogProps {
  title: string;
  description: string;
  className?: string;
  triggerClassName?: string;
}

export function InfoDialog({
  title,
  description,
  className,
  triggerClassName,
}: InfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-8 rounded-full p-0", triggerClassName)}
          aria-label={`Info about ${title}`}
        >
          <HelpCircle className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}