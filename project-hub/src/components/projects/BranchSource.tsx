export function BranchSource({
  from = "Main",
  branch,
}: {
  from?: string;
  branch: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold">{from}</span>
      <span className="text-[10px] text-muted-foreground/70">→</span>
      <span className="rounded bg-muted px-1.5 py-[1px] font-mono text-[10px] text-foreground">
        {branch}
      </span>
    </span>
  );
}
