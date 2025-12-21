import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CategoriesInfoModalProps {
  onClose: () => void;
}

export function CategoriesInfoModal({ onClose }: CategoriesInfoModalProps) {
  const categoriesWithDescriptions = useQuery(api.games.getCategoriesWithDescriptions);

  if (categoriesWithDescriptions === undefined) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">معنى التصنيفات</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {categoriesWithDescriptions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏷️</div>
              <p className="text-gray-400">لا توجد تصنيفات حالياً</p>
            </div>
          ) : (
            categoriesWithDescriptions.map((tag) => (
              <div
                key={tag._id}
                className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex-shrink-0">
                    {tag.name}
                  </div>
                  <div className="flex-1">
                    {tag.description ? (
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {tag.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        لا يوجد وصف لهذا التصنيف
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
