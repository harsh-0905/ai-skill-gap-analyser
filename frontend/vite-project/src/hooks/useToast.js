import { useState } from "react";
 
/**
 * useToast — manages a stack of toast notifications.
 * Returns { toasts, addToast, dismissToast }
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
 
  const addToast = (msg, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };
 
  const dismissToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));
 
  return { toasts, addToast, dismissToast };
}