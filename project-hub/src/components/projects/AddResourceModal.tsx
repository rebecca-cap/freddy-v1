import { useEffect, useRef, useState } from "react";
import { FolderOpen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api, type ResourceType } from "@/lib/api";
import { cn } from "@/lib/utils";

// File-track types (URL track is handled as the special "links" mode).
const FILE_TYPES: { key: ResourceType; icon: string; label: string }[] = [
  { key: "docs", icon: "📄", label: "Docs" },
  { key: "interviews", icon: "📝", label: "Interviews" },
  { key: "competitive", icon: "🧭", label: "Competitive" },
  { key: "screenshots", icon: "📷", label: "Screenshots" },
];
const URL_TYPE = { key: "links" as const, icon: "🔗", label: "Link / URL" };

type AddType = ResourceType | "links";

interface Props {
  slug: string;
  open: boolean;
  /** Category active in the rail when the modal opened — sets the default mode. */
  defaultType?: AddType;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful upload or URL add so the tab can refresh. */
  onAdded: () => void;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

export default function AddResourceModal({
  slug,
  open,
  defaultType = "docs",
  onOpenChange,
  onAdded,
}: Props) {
  const [addType, setAddType] = useState<AddType>(defaultType);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL-mode fields
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  // file-mode drag state
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset to the active category's mode each time the modal opens.
  useEffect(() => {
    if (open) {
      setAddType(defaultType);
      setUrl("");
      setTitle("");
      setNote("");
      setError(null);
      setBusy(false);
      setDragOver(false);
    }
  }, [open, defaultType]);

  const isUrl = addType === "links";
  const fileType = isUrl ? null : (addType as ResourceType);
  const subPath = fileType ? `resources/${fileType}/` : "resources/";

  async function handleFile(file: File) {
    if (!fileType) return;
    setBusy(true);
    setError(null);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await api.uploadResource(slug, {
        type: fileType,
        name: file.name,
        dataBase64: dataUrl, // server strips the data: prefix
      });
      onAdded();
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleReveal() {
    setError(null);
    try {
      await api.revealResources(slug, fileType ? `${fileType}/` : undefined);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    }
  }

  const canSubmitUrl = url.trim().length > 0 && title.trim().length > 0;

  async function handleSubmitUrl() {
    if (!canSubmitUrl) return;
    setBusy(true);
    setError(null);
    try {
      await api.addExternalResource(slug, {
        category: "links",
        title: title.trim(),
        url: url.trim(),
        note: note.trim() || undefined,
      });
      onAdded();
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] gap-4 p-0">
        <DialogHeader className="border-b p-4 text-left">
          <DialogTitle className="text-base">
            {isUrl ? "Add link / URL" : "Add resource"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-4">
          {/* Type segmented selector */}
          <div>
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Type
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[...FILE_TYPES, URL_TYPE].map((t) => {
                const isActive = t.key === addType;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setAddType(t.key)}
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "bg-card text-foreground hover:bg-muted",
                    )}
                  >
                    <span aria-hidden="true">{t.icon}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {/* File mode */}
          {!isUrl && (
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) void handleFile(f);
                }}
                className={cn(
                  "flex w-full flex-col items-center gap-1.5 rounded-md border-2 border-dashed bg-muted/40 p-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50",
                  dragOver && "border-primary text-primary",
                )}
              >
                <Upload className="h-6 w-6" />
                {busy ? "Uploading…" : "Drag a file here, or click to choose"}
                <span className="text-xs">
                  saves into <code className="font-mono">{subPath}</code>
                </span>
              </button>
              <button
                type="button"
                onClick={handleReveal}
                className="flex w-full items-center justify-center gap-1.5 text-xs text-primary hover:underline"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                or reveal <code className="font-mono">{subPath}</code> to drop a
                batch →
              </button>
            </div>
          )}

          {/* URL mode */}
          {isUrl && (
            <div className="space-y-2">
              <Input
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://…  (link, Loom, or hosted doc)"
              />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note (optional)"
              />
              <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-400">
                🎥 Loom / hosted video goes here too — it's a URL, saved to{" "}
                <code className="font-mono">external.json</code>.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t bg-muted/30 p-3 sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          {isUrl ? (
            <Button
              size="sm"
              onClick={handleSubmitUrl}
              disabled={busy || !canSubmitUrl}
            >
              Add link
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
            >
              Choose file
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
