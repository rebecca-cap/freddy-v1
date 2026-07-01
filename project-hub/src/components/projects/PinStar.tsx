import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function PinStar({
  pinned,
  onToggle,
  className,
}: {
  pinned: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={pinned ? "Unpin" : "Pin to favorites"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors",
        pinned
          ? "text-amber-500"
          : "text-muted-foreground/50 hover:text-foreground",
        className,
      )}
    >
      <Star
        className={cn("h-4 w-4", pinned && "fill-amber-500 text-amber-500")}
      />
    </button>
  );
}
