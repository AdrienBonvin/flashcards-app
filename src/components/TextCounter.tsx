interface TextCounterProps {
  text: string;
  counter: number;
  classNameText?: string;
}

export const TextCounter: React.FC<TextCounterProps> = ({
  text,
  counter,
  classNameText,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className={classNameText}>{text}</p>
      <b className="text-contrast font-extrabold text-6xl">{counter}</b>
    </div>
  );
};
