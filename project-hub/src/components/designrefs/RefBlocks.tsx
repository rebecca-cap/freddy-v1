import { useState } from "react";
import { Check, Copy, ExternalLink, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast";
import { designRefFileUrl, type RefBlock, type RefKind } from "@/lib/designRefs";

/** Render `inline code` spans inside prose strings. */
export function InlineCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <code
            key={i}
            className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-base font-semibold tracking-tight">{children}</h3>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const { copy } = useToast();
  return (
    <button
      type="button"
      onClick={() => {
        copy(text, "Copied code");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={cn(
        "absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-card/80 text-muted-foreground backdrop-blur transition-colors",
        "hover:bg-muted hover:text-foreground",
        copied && "border-primary/40 text-primary",
      )}
      title={copied ? "Copied" : "Copy code"}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

const TABLE_HEAD =
  "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground";
const TABLE_CELL = "px-3 py-2.5 align-top text-sm";

function RefTable({
  head,
  rows,
}: {
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/40">
            {head.map((h) => (
              <th key={h} className={TABLE_HEAD}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b last:border-b-0">
              {cells.map((cell, j) => (
                <td key={j} className={TABLE_CELL}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const MONO_NAME = "whitespace-nowrap font-mono text-[13px] text-foreground";

export function RefBlockView({ block, kind }: { block: RefBlock; kind: RefKind }) {
  switch (block.type) {
    case "specimen": {
      const src = designRefFileUrl(kind, block.image);
      return (
        <figure>
          <div className="flex items-baseline justify-between gap-3">
            <BlockTitle>{block.title}</BlockTitle>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="mb-3 inline-flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              title="Open full-size capture"
            >
              Full size <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="overflow-hidden rounded-lg border bg-card p-3">
            <img
              src={src}
              alt={block.title}
              loading="lazy"
              className="h-auto w-full rounded-sm"
              data-design-ref-specimen
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
              <InlineCode text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    case "usage":
      return (
        <div>
          {block.title && <BlockTitle>{block.title}</BlockTitle>}
          <div className="space-y-3">
            {block.body.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/90">
                <InlineCode text={para.trim()} />
              </p>
            ))}
          </div>
        </div>
      );

    case "props":
      return (
        <div>
          <BlockTitle>{block.title}</BlockTitle>
          {block.intro && (
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              <InlineCode text={block.intro} />
            </p>
          )}
          <RefTable
            head={["Prop", "Type", "Default", "Notes"]}
            rows={block.rows.map((r) => [
              <span className={MONO_NAME}>{r.prop}</span>,
              <span className="font-mono text-xs text-muted-foreground">{r.type}</span>,
              r.default ? (
                <span className="font-mono text-xs text-muted-foreground">{r.default}</span>
              ) : (
                <span className="text-muted-foreground/50">—</span>
              ),
              <span className="text-foreground/90">
                <InlineCode text={r.notes} />
              </span>,
            ])}
          />
        </div>
      );

    case "variants":
      return (
        <div>
          <BlockTitle>{block.title}</BlockTitle>
          {block.intro && (
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              <InlineCode text={block.intro} />
            </p>
          )}
          <RefTable
            head={["Variant", "When to use", "Code"]}
            rows={block.rows.map((r) => [
              <span className={MONO_NAME}>{r.name}</span>,
              <span className="text-foreground/90">
                <InlineCode text={r.when} />
              </span>,
              r.code ? (
                <code className="font-mono text-xs text-muted-foreground">{r.code}</code>
              ) : (
                <span className="text-muted-foreground/50">—</span>
              ),
            ])}
          />
        </div>
      );

    case "tokens":
      return (
        <div>
          <BlockTitle>{block.title}</BlockTitle>
          {block.intro && (
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              <InlineCode text={block.intro} />
            </p>
          )}
          <RefTable
            head={["Token", "Value", "Use for"]}
            rows={block.rows.map((r) => [
              <span className={MONO_NAME}>{r.token}</span>,
              <span className="font-mono text-xs text-muted-foreground">{r.value}</span>,
              <span className="text-foreground/90">
                <InlineCode text={r.use} />
              </span>,
            ])}
          />
        </div>
      );

    case "code":
      return (
        <div>
          {block.title && <BlockTitle>{block.title}</BlockTitle>}
          <div className="relative overflow-hidden rounded-lg border bg-background">
            <CopyButton text={block.code} />
            <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-foreground/90">
              {block.code}
            </pre>
          </div>
          {block.note && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              <InlineCode text={block.note} />
            </p>
          )}
        </div>
      );

    case "dosdonts":
      return (
        <div>
          <BlockTitle>{block.title ?? "Do's & Don'ts"}</BlockTitle>
          <div className="space-y-3">
            {block.items.map((item, i) => (
              <div key={i} className="overflow-hidden rounded-lg border">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  <div className="border-l-2 border-emerald-500/70 p-3">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-500">
                      Do
                    </div>
                    <div className="text-sm leading-relaxed text-foreground/90">
                      <InlineCode text={item.do} />
                    </div>
                  </div>
                  <div className="border-l-2 border-destructive/70 p-3 max-sm:border-t sm:border-t-0">
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-destructive">
                      Don't
                    </div>
                    <div className="text-sm leading-relaxed text-foreground/90">
                      <InlineCode text={item.dont} />
                    </div>
                  </div>
                </div>
                {item.why && (
                  <div className="border-t bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                    <InlineCode text={item.why} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "gotchas":
      return (
        <div>
          <BlockTitle>{block.title ?? "Gotchas"}</BlockTitle>
          <div className="space-y-3">
            {block.items.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-3"
              >
                <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                  <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <InlineCode text={item.title} />
                </div>
                <div className="pl-[22px] text-sm leading-relaxed text-foreground/80">
                  <InlineCode text={item.detail} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "rules":
      return (
        <div>
          <BlockTitle>{block.title}</BlockTitle>
          {block.intro && (
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
              <InlineCode text={block.intro} />
            </p>
          )}
          <ol className="space-y-3">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="text-sm font-medium leading-relaxed">
                    <InlineCode text={item.rule} />
                  </span>
                  {item.why && (
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                      <InlineCode text={item.why} />
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        </div>
      );

    default:
      return null;
  }
}
