"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

// ── Toasts ────────────────────────────────────────────────────────────────

type Toast = { id: number; message: string; kind: "success" | "error" };
const ToastContext = createContext<(message: string, kind?: Toast["kind"]) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 6000 : 3000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex animate-fade-up items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-lg ${
              t.kind === "success" ? "bg-leaf-dark" : "bg-poppy-dark"
            }`}
          >
            {t.kind === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Form pieces ───────────────────────────────────────────────────────────

export function Card({ title, description, children, actions }: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm md:p-4">
      {(title || actions) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, children, className = "" }: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/35 transition focus:border-poppy focus:outline-none focus:ring-4 focus:ring-poppy/10 disabled:bg-ink/5";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={`${inputClass} resize-y ${props.className ?? ""}`} />;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 text-sm font-medium"
    >
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-leaf" : "bg-ink/20"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

export function IconButton({ label, children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted transition hover:bg-ink/5 hover:text-ink disabled:pointer-events-none disabled:opacity-30 ${className}`}
    >
      {children}
    </button>
  );
}

// ── Save bar ──────────────────────────────────────────────────────────────

/** Sticky "you have unsaved changes" bar shown at the bottom of an editor. */
export function SaveBar({ dirty, saving, onSave, onDiscard }: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!dirty && !saving) return null;
  return (
    <div className="sticky bottom-4 z-20 mt-6 flex animate-fade-up items-center justify-between gap-4 rounded-2xl bg-ink px-5 py-3.5 text-cream shadow-2xl sm:flex-col sm:items-stretch">
      <span className="flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-crust" />
        You have unsaved changes
      </span>
      <div className="flex gap-2 sm:justify-end">
        <button type="button" onClick={onDiscard} disabled={saving} className="btn !py-2 text-cream/80 hover:bg-white/10">
          Discard
        </button>
        <button type="button" onClick={onSave} disabled={saving} className="btn-primary !py-2">
          {saving ? "Saving…" : "Save & publish"}
        </button>
      </div>
    </div>
  );
}

/** Draft/saved pair with a dirty flag, shared by every editor. */
export function useDraft<T>(initial: T) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  return { draft, setDraft, saved, setSaved, dirty, discard: () => setDraft(saved) };
}
