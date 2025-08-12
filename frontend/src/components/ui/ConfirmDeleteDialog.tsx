import * as React from "react";
import { Trash2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ConfirmDeleteDialogProps {
  title: string;
  description: string;
  isPending: boolean;
  isError: boolean;
  onDelete: () => void;
  className?: string;
  triggerClassName?: string;
  errorMessage?: string;
}

export function ConfirmDeleteDialog({
  title,
  description,
  isPending,
  isError,
  onDelete,
  className,
  triggerClassName,
  errorMessage = "An error occurred while deleting.",
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleDelete = async () => {
    await onDelete();
    if (!isError) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("", triggerClassName)}
          aria-label={`Delete ${title}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>Delete {title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {isError && (
          <div className="flex items-center gap-2 text-destructive mt-2">
            <AlertCircle className="size-4" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}