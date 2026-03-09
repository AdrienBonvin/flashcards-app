import { Link, LinkProps } from "react-router-dom";

interface LinkButtonProps extends LinkProps {
  variant: "primary" | "secondary" | "highlight" | "contrast";
  outlineStyle?: boolean;
  additionnalClassName?: string;
  children: React.ReactNode;
}

const variantStyles = {
  primary: {
    filled: "bg-primary hover:bg-primary-hover text-white border-primary",
    outline:
      "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",
  },
  secondary: {
    filled: "bg-secondary text-gray-900 border-secondary hover:bg-secondary-hover",
    outline:
      "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10",
  },
  highlight: {
    filled: "bg-highlight text-gray-900 border-highlight",
    outline:
      "border-2 border-highlight text-highlight bg-transparent hover:bg-highlight/10",
  },
  contrast: {
    filled: "bg-contrast hover:bg-contrast-hover text-gray-900 border-contrast",
    outline:
      "border-2 border-contrast text-contrast bg-transparent hover:bg-contrast/10",
  },
};

export const LinkButton: React.FC<LinkButtonProps> = ({
  variant,
  outlineStyle,
  additionnalClassName,
  children,
  ...props
}) => {
  const baseStyles =
    "py-3 px-5 rounded-xl font-semibold transition-all duration-200 ease-smooth active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background block";
  const variantStyle = outlineStyle
    ? variantStyles[variant].outline
    : variantStyles[variant].filled;

  return (
    <Link
      {...props}
      className={`${baseStyles} ${variantStyle} ${additionnalClassName ?? ""}`}
    >
      {children}
    </Link>
  );
};
