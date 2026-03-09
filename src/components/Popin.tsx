interface PopinProps {
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
}

const Popin: React.FC<PopinProps> = ({ onClose, children, title }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "popin-title" : undefined}
    >
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border border-surface-elevated bg-surface shadow-2xl animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 p-2 rounded-xl text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="p-6 pt-10">
          {title && (
            <h2
              id="popin-title"
              className="text-xl font-bold text-primary mb-5"
            >
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popin;
