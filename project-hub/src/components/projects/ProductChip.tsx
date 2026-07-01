import { cn } from "@/lib/utils";

export type ProductKind = "sdi" | "pe" | "ss";

export const PRODUCT_KINDS: ProductKind[] = ["sdi", "pe", "ss"];

const DOT_CLASS: Record<ProductKind, string> = {
  sdi: "bg-blue-600",
  pe: "bg-violet-600",
  ss: "bg-teal-600",
};

export const PRODUCT_LABEL: Record<ProductKind, string> = {
  sdi: "S & D · Incab",
  pe: "Pricing Engine",
  ss: "Selling Platform",
};

export function ProductChip({ product }: { product: ProductKind }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("h-2 w-2 shrink-0 rounded-full", DOT_CLASS[product])} />
      <span>{PRODUCT_LABEL[product]}</span>
    </span>
  );
}
