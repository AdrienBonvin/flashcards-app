import React, { useEffect, useState } from "react";

interface FlipCardProps {
  question: string;
  answer: string;
  onCardFlip?: (isFlipped: boolean) => void;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  question,
  answer,
  onCardFlip,
  className,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    onCardFlip?.(isFlipped);
  }, [isFlipped]);
  return (
    <div
      className={`h-[60vh] w-full [perspective:1000px] ${className}`}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      <div
        className={`relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute h-full w-full rounded-xl border flex items-center justify-center text-2xl p-4 [backface-visibility:hidden]">
          <p className="text-center break-words w-full h-full overflow-auto">
            {question}
          </p>
        </div>

        <div className="absolute h-full w-full rounded-xl border flex items-center justify-center p-4 text-center text-2xl text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="text-center break-words w-full h-full overflow-auto">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
