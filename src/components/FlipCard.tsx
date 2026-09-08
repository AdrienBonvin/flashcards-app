import React, { useMemo, useState } from "react";

interface FlipCardProps {
  question: string;
  answer: string;
  onCardFlip?: (isFlipped: boolean) => void;
  /** Mode contrôlé : l'état retourné est piloté par le parent (raccourcis clavier…) */
  flipped?: boolean;
  goldenCard?: boolean;
  className?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({
  question,
  answer,
  onCardFlip,
  flipped,
  goldenCard,
  className,
}) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isFlipped = flipped ?? internalFlipped;
  const [goldShineAnimation, setGoldShineAnimation] = useState(goldenCard);

  const cardStyle = useMemo(
    () =>
      (goldenCard
        ? "bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border-2 border-amber-700/50 shadow-lg"
        : "bg-gradient-to-br from-slate-50 to-slate-200 border border-slate-300/80 shadow-card") +
      " absolute h-full w-full rounded-xl flex items-center justify-center text-xl md:text-2xl text-gray-900 font-semibold p-4",
    [goldenCard]
  );

  const flip = () => {
    const next = !isFlipped;
    if (flipped === undefined) setInternalFlipped(next);
    onCardFlip?.(next);
  };

  return (
    <div
      className={`h-[60vh] w-full [perspective:1000px] cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className ?? ""}`}
      onClick={flip}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Réponse. Retourner la carte" : "Question. Retourner la carte"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flip();
        }
      }}
    >
      <div
        className={`relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : goldShineAnimation
              ? "golden-shine"
              : ""
        }`}
        onTransitionEnd={() => {
          if (isFlipped) return;
          if (goldenCard) setGoldShineAnimation(true);
        }}
        onAnimationEnd={() => {
          if (goldenCard) setGoldShineAnimation(false);
        }}
      >
        <div className={`${cardStyle} [backface-visibility:hidden]`}>
          <p className="text-center break-words w-full h-full overflow-auto whitespace-pre-line">
            {question}
          </p>
        </div>

        <div
          className={`${cardStyle} [transform:rotateY(180deg)] [backface-visibility:hidden]`}
          aria-hidden={!isFlipped}
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
