import React, { useEffect, useMemo, useState } from "react";

interface FlipCardProps {
  question: string;
  answer: string;
  onCardFlip?: (isFlipped: boolean) => void;
  goldenCard?: boolean;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  question,
  answer,
  onCardFlip,
  goldenCard,
  className,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardStyle = useMemo(
    () =>
      `${
        goldenCard
          ? "bg-gradient-to-br from-yellow-200 to-yellow-700  border-yellow-950"
          : "bg-gradient-to-br from-white to-slate-200 border-slate-400"
      } absolute h-full w-full rounded-xl border flex items-center justify-center text-2xl text-gray-900 font-semibold p-4`,
    []
  );

  useEffect(() => {
    onCardFlip?.(isFlipped);
  }, [isFlipped]);
  return (
    <div
      className={`h-[60vh] w-full [perspective:1000px] ${className}`}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className={`relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d]  ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className={`${cardStyle} [backface-visibility:hidden]`}>
          <p className="text-center break-words w-full h-full overflow-auto whitespace-pre-line">
            {question}
          </p>
        </div>

        <div
          className={`${cardStyle} [transform:rotateY(180deg)] [backface-visibility:hidden]`}
        >
          <p className="text-center break-words w-full h-full overflow-auto whitespace-pre-line">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
