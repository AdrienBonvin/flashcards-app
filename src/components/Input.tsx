export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    {...props}
    className={`w-full p-4 rounded-xl bg-surface border border-surface-elevated text-text-primary placeholder:text-muted transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${className}`}
    type="text"
  />
);
