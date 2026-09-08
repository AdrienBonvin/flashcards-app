import { forwardRef, useEffect, useState } from "react";

interface ProgressBarProps {
  initialCount: number;
  counter: number;
  className: string;
  /** Passe à true quand l'animation du nombre flottant atteint la barre : déclenche le remplissage */
  triggerAnimations: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ initialCount, counter, className, triggerAnimations }, ref) => {
    // La barre ne se remplit qu'à l'arrivée du nombre flottant, pas dès la mise à jour de l'état
    const [displayedCounter, setDisplayedCounter] = useState(counter);

    useEffect(() => {
      if (triggerAnimations) setDisplayedCounter(counter);
    }, [triggerAnimations, counter]);

    const done = Math.max(0, initialCount - displayedCounter);
    const progressPercentage =
      initialCount > 0 ? Math.min(100, (done / initialCount) * 100) : 0;

    return (
      <div
        role="progressbar"
        aria-label="Progression de la révision"
        aria-valuemin={0}
        aria-valuemax={initialCount}
        aria-valuenow={done}
        className={`h-2.5 bg-surface-elevated rounded-full overflow-hidden ${className} ${
          triggerAnimations ? "ping-progress" : ""
        }`}
      >
        <div
          ref={ref}
          className={`h-full bg-gradient-to-r from-contrast to-primary rounded-full ${
            triggerAnimations ? "progress-bar-filling" : ""
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    );
  }
);
