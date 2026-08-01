"use client";

import {
  Settings2,
  Maximize2,
  MoreVertical,
} from "lucide-react";

interface WidgetToolbarProps {
  onSettings?: () => void;
  onExpand?: () => void;
  onMenu?: () => void;

  showSettings?: boolean;
  showExpand?: boolean;
  showMenu?: boolean;
}

const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="
      flex
      h-9
      w-9
      items-center
      justify-center

      rounded-xl

      text-neutral-500

      transition-all
      duration-200

      hover:bg-neutral-100
      hover:text-neutral-900

      active:scale-95
    "
  >
    {children}
  </button>
);

export default function WidgetToolbar({
  onSettings,
  onExpand,
  onMenu,

  showSettings = true,
  showExpand = true,
  showMenu = true,
}: WidgetToolbarProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-1

        rounded-2xl

        border
        border-border

        bg-white/70

        px-1
        py-1

        backdrop-blur-sm
      "
    >
      {showSettings && (
        <Button onClick={onSettings}>
          <Settings2 size={16} strokeWidth={2} />
        </Button>
      )}

      {showExpand && (
        <Button onClick={onExpand}>
          <Maximize2 size={16} strokeWidth={2} />
        </Button>
      )}

      {showMenu && (
        <Button onClick={onMenu}>
          <MoreVertical size={16} strokeWidth={2} />
        </Button>
      )}
    </div>
  );
}