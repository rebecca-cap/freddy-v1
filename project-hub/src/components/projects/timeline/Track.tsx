import { cn } from "@/lib/utils";

interface Props {
  /** Label shown in the leading w-44 box. */
  label: React.ReactNode;
  /** Chip content rendered along the track line. */
  chips?: React.ReactNode;
  /** Trailing slot (actions / add button) after the chips. */
  trailing?: React.ReactNode;
  /** Render the track line dashed (used for branch / variant rows). */
  dashed?: boolean;
  /** Indent the chips to visually branch off the mainline. */
  offset?: boolean;
}

/**
 * Presentational timeline track row: leading label box | horizontal line
 * (solid for mainline, dashed + offset for branch rows) | chips | trailing slot.
 * Shared by the Lo-fi placeholder and the Hi-fi variant rows.
 */
export function Track({ label, chips, trailing, dashed, offset }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-44 shrink-0 text-xs font-semibold text-muted-foreground">
        {label}
      </div>
      <div className={cn("flex-1", offset && "pl-12")}>
        <div className="relative inline-flex w-fit items-center gap-3">
          <div
            className={cn(
              "absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border",
              dashed && "border-t border-dashed bg-transparent",
            )}
          />
          <div className="relative flex items-center gap-3">
            {chips}
            {trailing}
          </div>
        </div>
      </div>
    </div>
  );
}
