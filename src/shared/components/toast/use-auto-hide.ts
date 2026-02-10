import { useEffect, useState } from "react";

export function useAutoHide(
  open: boolean,
  duration: number,
  onClose: () => void,
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  return { visible, show: open || visible };
}
