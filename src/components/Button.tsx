interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "highlight" | "contrast";
  additionnalClassName?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  additionnalClassName,
  children,
  ...props
}) => {
  let backgroundColor = "";
  switch (variant) {
    case "primary":
      backgroundColor = "bg-primary";
      break;
    case "secondary":
      backgroundColor = "bg-secondary";
      break;
    case "highlight":
      backgroundColor = "bg-highlight";
      break;
    case "contrast":
      backgroundColor = "bg-contrast";
      break;
  }
  return (
    <button
      {...props}
      className={`py-3 px-6 rounded-lg disabled:border disabled:border-gray-400 disabled:text-gray-400 disabled:bg-transparent ${backgroundColor} ${additionnalClassName}`}
    >
      {children}
    </button>
  );
};
