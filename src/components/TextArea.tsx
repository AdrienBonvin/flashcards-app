import { Ref } from "react";

export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: Ref<HTMLTextAreaElement>;
    className?: string;
  }
> = ({ ref, className = "", ...props }) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-full p-4 rounded-xl bg-surface border border-surface-elevated text-text-primary placeholder:text-muted transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none ${className}`}
  />
);
