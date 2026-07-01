import { cn } from "@/lib/utils";

const AVATAR_GRADIENTS: Record<string, string> = {
  fo: "bg-gradient-to-br from-blue-600 to-blue-800",
  ry: "bg-gradient-to-br from-emerald-600 to-emerald-800",
  hu: "bg-gradient-to-br from-amber-600 to-amber-800",
  je: "bg-gradient-to-br from-violet-600 to-violet-800",
  default: "bg-gradient-to-br from-slate-500 to-slate-700",
};

export function Avatar({
  initials,
  src,
  size = "sm",
}: {
  initials: string;
  src?: string;
  size?: "sm" | "md";
}) {
  const sizeClasses =
    size === "sm" ? "h-[18px] w-[18px] text-[9px]" : "h-6 w-6 text-[10px]";
  if (src) {
    return (
      <img
        src={src}
        alt={initials}
        className={cn(
          "inline-flex shrink-0 rounded-full object-cover",
          sizeClasses,
        )}
      />
    );
  }
  const key = initials.toLowerCase();
  const gradient = AVATAR_GRADIENTS[key] ?? AVATAR_GRADIENTS.default;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase text-white",
        gradient,
        sizeClasses,
      )}
    >
      {initials}
    </span>
  );
}
