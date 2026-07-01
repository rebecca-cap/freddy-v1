import { useEffect, useState } from "react";
import { GitBranchPlus } from "lucide-react";
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
import { api, type VersionRecord } from "@/lib/api";

interface Props {
  slug: string;
  onCreated?: () => void;
  /** Available versions to fork from (latest is last). */
  versions?: VersionRecord[];
  /** Controlled open state. When provided, the internal trigger is hidden. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Preset version label to fork from. */
  fromVersion?: string;
}

const inputClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export default function NewVariantDialog({
  slug,
  onCreated,
  versions,
  open: controlledOpen,
  onOpenChange,
  fromVersion,
}: Props) {
  const controlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? controlledOpen : internalOpen;

  const versionLabels = versions ?? [];
  const latest = versionLabels[versionLabels.length - 1]?.label;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState<string | undefined>(fromVersion ?? latest);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync the selected version when the dialog opens preset to a version.
  useEffect(() => {
    if (open) setVersion(fromVersion ?? latest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fromVersion, latest]);

  function setOpen(o: boolean) {
    if (controlled) onOpenChange?.(o);
    else setInternalOpen(o);
  }

  function reset() {
    setName("");
    setDescription("");
    setError(null);
    setSubmitting(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.createVariant(slug, name, description || undefined, version);
      onCreated?.();
      setOpen(false);
      reset();
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setSubmitting(false);
    }
  }

  const forkLabel = version ?? latest ?? "the latest version";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      {!controlled && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <GitBranchPlus className="h-3.5 w-3.5" />
            New variation
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {fromVersion ? `Fork a variation from ${fromVersion}` : "New variation"}
            </DialogTitle>
            <DialogDescription>
              Forks a per-client copy from {forkLabel} — own branch, own
              localhost.
            </DialogDescription>
          </DialogHeader>

          {versionLabels.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="variant-version">Fork from</Label>
              <select
                id="variant-version"
                className={inputClass}
                value={version ?? latest ?? ""}
                onChange={(e) => setVersion(e.target.value)}
              >
                {versionLabels.map((v) => (
                  <option key={v.label} value={v.label}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="variant-name">Name</Label>
            <Input
              id="variant-name"
              autoFocus
              required
              placeholder="Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variant-description">Description (optional)</Label>
            <textarea
              id="variant-description"
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Short note about what this variation explores"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Creating..." : "Create variation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
