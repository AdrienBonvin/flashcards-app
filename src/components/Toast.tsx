import { useEffect } from "react";
import { useUserDataContext } from "../contexts/UserDataContext";

const AUTO_HIDE_MS = 5000;

/** Affiche les erreurs remontées par le contexte (échec réseau, écriture Firestore…) */
export const Toast: React.FC = () => {
  const { notice, setNotice } = useUserDataContext();

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), AUTO_HIDE_MS);
    return () => clearTimeout(timeout);
  }, [notice, setNotice]);

  if (!notice) return null;

  return (
    <div
      role="alert"
      className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[70] max-w-[90vw] flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-elevated border border-contrast/60 text-text-primary text-sm shadow-card-hover animate-modal-in"
    >
      <span>{notice}</span>
      <button
        onClick={() => setNotice(null)}
        aria-label="Fermer"
        className="shrink-0 text-muted hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
