import { useState } from "react";

interface TagWithDescriptionProps {
  name: string;
  description?: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  showDoubleClickHint?: boolean;
}

export function TagWithDescription({ 
  name, 
  description, 
  isSelected = false, 
  onClick, 
  className = "",
  showDoubleClickHint = false
}: TagWithDescriptionProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
    }

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount === 1) {
      // First click - handle selection
      if (onClick) {
        onClick();
      }
      
      // Set timer for double click detection (only for admins)
      if (showDoubleClickHint) {
        const timer = setTimeout(() => {
          setClickCount(0);
        }, 300);
        setClickTimer(timer);
      } else {
        setClickCount(0);
      }
    } else if (newClickCount === 2 && showDoubleClickHint) {
      // Double click - show description (only for admins)
      if (description) {
        setShowDescription(true);
      }
      setClickCount(0);
    }
  };

  const closeDescription = () => {
    setShowDescription(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm relative ${
          isSelected
            ? "bg-purple-600 text-white shadow-lg"
            : "bg-white/10 text-purple-200 hover:bg-white/20"
        } ${className}`}
        title={showDoubleClickHint && description ? "اضغط مرتين لرؤية الوصف" : undefined}
      >
        {name}
        {showDoubleClickHint && description && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
        )}
      </button>

      {/* Description Modal (only for admins) */}
      {showDescription && description && showDoubleClickHint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <button
                onClick={closeDescription}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed">{description}</p>
            <button
              onClick={closeDescription}
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
}
