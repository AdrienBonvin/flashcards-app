interface PopinProps {
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
}

const Popin: React.FC<PopinProps> = ({ onClose, children, title }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-xl border border-highlight/50 bg-background shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="p-6 pt-8">
          {title && (
            <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popin;
