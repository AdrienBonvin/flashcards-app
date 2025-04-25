interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "highlight" | "contrast";
  outlineStyle?: boolean;
  additionnalClassName?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  outlineStyle,
  additionnalClassName,
  children,
  ...props
}) => {
  let backgroundColor = "";
  switch (variant) {
    case "primary":
      backgroundColor = outlineStyle
        ? "border border-primary border-2"
        : "bg-primary";
      break;
    case "secondary":
      backgroundColor = outlineStyle
        ? "border border-secondary border-2"
        : "bg-secondary";
      break;
    case "highlight":
      backgroundColor = outlineStyle
        ? "border border-highlight border-2"
        : "bg-highlight";
      break;
    case "contrast":
      backgroundColor = outlineStyle
        ? "border border-contrast border-2"
        : "bg-contrast";
      break;
  }
  return (
    <button
      {...props}
      className={`py-3 px-6 rounded-lg disabled:border disabled:border-gray-400 disabled:text-gray-400 disabled:bg-transparent  transform active:scale-90 transition-transform duration-150 ${backgroundColor} ${additionnalClassName}`}
    >
      {children}
    </button>
  );
};
