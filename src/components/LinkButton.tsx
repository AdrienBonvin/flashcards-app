import { Link, LinkProps } from "react-router-dom";

interface LinkButtonProps extends LinkProps {
  variant: "primary" | "secondary" | "highlight" | "contrast";
  outlineStyle?: boolean;
  additionnalClassName?: string;
  children: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
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
    <Link
      {...props}
      className={`py-3 px-4 rounded-lg  ${backgroundColor} ${additionnalClassName}`}
    >
      {children}
    </Link>
  );
};
