export interface RoundButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position?: "right" | "left" | "center" | "top-left" | "top-right" | "inline";
  className?: string;
  children: React.ReactNode;
}

export const RoundButton: React.FC<RoundButton> = ({
  position = "inline",
  className,
  children,
  ...props
}) => {
  const positionMap: Record<string, string> = {
    right: "absolute right-6 bottom-6 md:right-8 md:bottom-8",
    left: "absolute left-6 bottom-6 md:left-8 md:bottom-8",
    "top-left": "absolute left-6 top-6 md:left-8 md:top-8",
    "top-right": "absolute right-6 top-6 md:right-8 md:top-8",
    center: "absolute left-1/2 -translate-x-1/2 bottom-8",
    inline: "",
  };

  return (
    <button
      {...props}
      className={`w-12 h-12 rounded-full flex items-center justify-center bg-surface border border-surface-elevated text-text-primary hover:bg-surface-elevated hover:border-primary/50 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${positionMap[position]} ${className ?? ""}`}
    >
      {children}
    </button>
  );
};
