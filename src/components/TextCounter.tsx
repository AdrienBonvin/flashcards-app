interface TextCounterProps {
  text: string;
  counter: number;
}

export const TextCounter: React.FC<TextCounterProps> = ({ text, counter }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>{text}</p>
      <b className="text-contrast font-extrabold text-6xl">{counter}</b>
    </div>
  );
};
