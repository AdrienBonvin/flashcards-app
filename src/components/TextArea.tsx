import { Ref } from "react";

export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    ref?: Ref<HTMLTextAreaElement>;
  }
> = ({ ref, ...props }) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-3/5 p-4 rounded-xl ${props.className ?? ""}`}
  />
);
