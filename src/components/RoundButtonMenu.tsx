import React, { useEffect, useMemo, useState } from "react";
import { RoundButton } from "./RoundButton";

interface RoundButtonMenuProps {
  mainIcon: React.ReactNode;
  classNameClosed?: string;
  position?: RoundButton["position"];
  children?: React.ReactNode;
}

export const RoundButtonMenu: React.FC<RoundButtonMenuProps> = ({
  mainIcon,
  classNameClosed,
  position,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const menuListPosition = useMemo(() => {
    switch (position) {
      case "right":
        return "right-8 bottom-24";
      case "left":
        return "left-8 bottom-24";
      case "top-left":
        return "left-8 top-24";
      case "top-right":
        return "right-8 top-24";
      case "center":
        return "bottom-24";
      case "inline":
        return "";
      default:
        return "";
    }
  }, [position]);

  return (
    <div ref={menuRef}>
      <RoundButton
        onClick={() => setOpen((prev) => !prev)}
        position={position}
        className={`${open ? "animate-pulse" : ` ${classNameClosed}`}`}
      >
        {mainIcon}
      </RoundButton>
      {open && (
        <div
          className={`absolute flex flex-col rounded-full gap-2 shadow-lg ${menuListPosition}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
