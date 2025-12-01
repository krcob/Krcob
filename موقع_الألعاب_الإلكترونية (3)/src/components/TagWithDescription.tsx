import { toast } from "sonner";
import { cn } from "../lib/utils";

interface TagWithDescriptionProps {
  name: string;
  description?: string | null;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  showDoubleClickHint?: boolean;
}

export function TagWithDescription({
  name,
  description,
  isSelected,
  onClick,
  className,
  showDoubleClickHint,
}: TagWithDescriptionProps) {
  
  const handleDoubleClick = () => {
    if (showDoubleClickHint && description) {
      toast.info(
        <div className="text-right">
          <h4 className="font-bold text-purple-200">{name}</h4>
          <p className="text-white">{description}</p>
        </div>
      );
    }
  };

  const baseClasses = "px-3 py-1 rounded-lg font-medium transition-all duration-200";
  const buttonClasses = "cursor-pointer";
  const selectedClasses = "bg-purple-600 text-white shadow-lg";
  const unselectedClasses = "bg-white/10 text-purple-200 hover:bg-white/20";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        onDoubleClick={handleDoubleClick}
        className={cn(
          baseClasses,
          buttonClasses,
          isSelected ? selectedClasses : unselectedClasses,
          className
        )}
        title={showDoubleClickHint ? "اضغط مرتين لعرض الوصف" : ""}
      >
        {name}
      </button>
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className={cn(baseClasses, className)}
      title={showDoubleClickHint ? "اضغط مرتين لعرض الوصف" : ""}
    >
      {name}
    </span>
  );
}
