import { useMemo, useRef } from "react";

interface ProgressBarProps {
  initialCount: number;
  counter: number;
  className: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  initialCount,
  counter,
  className,
}) => {
  const maxCount = useRef(initialCount);

  const progressPercentage = useMemo(
    () => ((maxCount.current - counter) / maxCount.current) * 100,
    [counter]
  );

  return (
    <div
      className={`h-2 bg-gray-300 rounded-full overflow-hidden ${className}`}
    >
      <div
        className="h-full bg-contrast"
        style={{
          width: `${progressPercentage}%`,
          transition: "width 0.5s ease-in-out",
        }}
      ></div>
    </div>
  );
};
