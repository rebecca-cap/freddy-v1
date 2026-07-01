import { useState } from "react";
import { Archive, FolderX, GitBranch, History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  project: {
    name: string;
    slug: string;
    branch: string;
    archived?: boolean;
  };
  busy: boolean;
  /** Archive (the reversible alternative). Resolves when the flag is flipped. */
  onArchive: () => void | Promise<void>;
  /** Permanently delete. Caller navigates away on success. */
  onConfirmDelete: () => void | Promise<void>;
}

// Destructive confirm for project deletion. Spells out the blast radius,
// pushes archive as the reversible alternative, and gates the delete behind
// a type-the-name check so it can't be fired by reflex.
export default function DeleteProjectDialog({
  project,
  busy,
  onArchive,
  onConfirmDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const canDelete =
    confirmText.trim().toLowerCase() === project.name.trim().toLowerCase();

  async function handleArchive() {
    await onArchive();
    setOpen(false);
  }

  async function handleDelete() {
    if (!canDelete) return;
    await onConfirmDelete();
    // On success the caller navigates away and this unmounts; if it errored,
    // the error surfaces on the page and the dialog stays open to retry.
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setConfirmText("");
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Delete project"
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="h-4 w-4" />
            </span>
            Delete “{project.name}”?
          </DialogTitle>
          <DialogDescription>
            This permanently removes the project and everything in it. It
            can’t be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Blast radius — be specific so the cost is legible. */}
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <p className="mb-2 font-medium text-foreground">What gets deleted</p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <FolderX className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Everything under{" "}
                <code className="rounded bg-muted px-1 py-px font-mono text-[11px] text-foreground">
                  ~/freddy/projects/{project.slug}
                </code>{" "}
                — kickoff, lo-fi rounds, resources, cover, and any handoff docs.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <GitBranch className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                The{" "}
                <code className="rounded bg-muted px-1 py-px font-mono text-[11px] text-foreground">
                  {project.branch}
                </code>{" "}
                branch and its prototype worktree.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <History className="mt-0.5 h-4 w-4 shrink-0" />
              <span>All hi-fi versions and git history for this project.</span>
            </li>
          </ul>
        </div>

        {/* The reversible path — offered first because it's usually the real intent. */}
        {!project.archived && (
          <div className="flex items-start gap-3 rounded-md border border-primary/30 bg-primary/5 p-3">
            <Archive className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium text-foreground">
                Just want it out of the way?
              </p>
              <p className="text-muted-foreground">
                Archiving hides it from the list and keeps everything. You can
                restore it anytime.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={handleArchive}
              disabled={busy}
            >
              Archive instead
            </Button>
          </div>
        )}

        {/* Type-to-confirm guard. */}
        <div className="space-y-2">
          <Label htmlFor="confirm-delete-name">
            Type{" "}
            <span className="font-semibold text-foreground">
              {project.name}
            </span>{" "}
            to confirm
          </Label>
          <Input
            id="confirm-delete-name"
            autoComplete="off"
            placeholder={project.name}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || busy}
          >
            {busy ? "Deleting…" : "Delete permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
