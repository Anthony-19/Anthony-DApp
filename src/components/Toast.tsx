import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
const listeners: Set<(t: ToastItem) => void> = new Set();

export const toast = (message: string, type: ToastType = "info") => {
  const item: ToastItem = { id: ++toastId, message, type };
  listeners.forEach((fn) => fn(item));
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 5000);
    };
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  const icons = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-icon">{icons[t.type]}</span>
          <span className="toast-msg">{t.message}</span>
          <button
            className="toast-close"
            onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
          >×</button>
        </div>
      ))}
    </div>
  );
};
