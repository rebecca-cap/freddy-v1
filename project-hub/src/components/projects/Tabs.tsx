import { cn } from "@/lib/utils";

export interface TabDef<TKey extends string = string> {
  key: TKey;
  label: string;
  count?: number | string;
  disabled?: boolean;
  disabledReason?: string;
}

interface Props<TKey extends string> {
  tabs: TabDef<TKey>[];
  active: TKey;
  onChange: (next: TKey) => void;
}

export function Tabs<TKey extends string>({
  tabs,
  active,
  onChange,
}: Props<TKey>) {
  return (
    <div className="border-b">
      <div role="tablist" className="-mb-px flex gap-1">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled || undefined}
              disabled={tab.disabled}
              title={tab.disabled ? tab.disabledReason : undefined}
              onClick={() => !tab.disabled && onChange(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
                tab.disabled &&
                  "cursor-not-allowed text-muted-foreground/50 hover:text-muted-foreground/50",
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
