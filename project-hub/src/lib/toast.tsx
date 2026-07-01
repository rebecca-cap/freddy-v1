import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertCircle, Check } from "lucide-react";

type Tone = "success" | "error";
type Toast = { id: number; msg: string; tone: Tone };

interface ToastApi {
  /** Show a transient confirmation pill. */
  show: (msg: string, tone?: Tone) => void;
  /** Copy text to the clipboard and confirm with a toast. */
  copy: (text: string, msg?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DURATION_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const show = useCallback((msg: string, tone: Tone = "success") => {
    const id = nextId.current++;
    setToasts((list) => [...list, { id, msg, tone }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, DURATION_MS);
  }, []);

  const copy = useCallback(
    (text: string, msg?: string) => {
      const ok = () => show(msg ?? "Copied to clipboard");
      const fail = () => show("Couldn't copy — try again", "error");
      try {
        const result = navigator.clipboard?.writeText(text);
        if (result && typeof result.then === "function") {
          result.then(ok).catch(fail);
        } else {
          ok();
        }
      } catch {
        fail();
      }
    },
    [show],
  );

  return (
    <ToastContext.Provider value={{ show, copy }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="flex max-w-[90vw] items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm text-background shadow-lg"
          >
            {t.tone === "error" ? (
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
            ) : (
              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            )}
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
