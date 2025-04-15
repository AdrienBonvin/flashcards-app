interface RoundButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position: "right" | "left" | "center" | "top" | "inline";
  children: React.ReactNode;
}
export const RoundButton: React.FC<RoundButton> = ({
  position,
  children,
  ...props
}) => {
  let buttonPosition: string = "";
  switch (position) {
    case "right":
      buttonPosition = "absolute right-8";
      break;
    case "left":
      buttonPosition = "absolute left-8";
      break;
    case "top":
      buttonPosition = "absolute left-8 top-0";
      break;
    case "center":
      buttonPosition = "absolute";
      break;
    case "inline":
      break;
  }

  return (
    <button
      {...props}
      className={`bottom-8 w-12 h-12 rounded-full flex items-center justify-center border border-secondary ${buttonPosition} ${props.className}`}
    >
      {children}
    </button>
  );
};
