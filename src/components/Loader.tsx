interface LoaderProps {
  loading: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ loading }) => {
  if (!loading) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-label="Chargement"
    >
      <img
        src="/icons/logo-512.png"
        alt=""
        width={96}
        height={96}
        className="w-24 h-24 animate-pulse"
      />
    </div>
  );
};
