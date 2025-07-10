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
  let buttonPosition: string = "";
  switch (position) {
    case "right":
      buttonPosition = "absolute right-8 bottom-8";
      break;
    case "left":
      buttonPosition = "absolute left-8 bottom-8 ";
      break;
    case "top-left":
      buttonPosition = "absolute left-8 top-8";
      break;
    case "top-right":
      buttonPosition = "absolute right-8 top-8";
      break;
    case "center":
      buttonPosition = "absolute bottom-8";
      break;
    case "inline":
      break;
  }

  return (
    <button
      {...props}
      className={`w-12 h-12 rounded-full flex items-center justify-center border border-secondary transform active:scale-90 transition-transform duration-150 ${buttonPosition} ${className}`}
    >
      {children}
    </button>
  );
};
