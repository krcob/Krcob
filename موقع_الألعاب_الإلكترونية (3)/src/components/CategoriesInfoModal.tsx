import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CategoriesInfoModalProps {
  onClose: () => void;
}

export function CategoriesInfoModal({ onClose }: CategoriesInfoModalProps) {
  const categories = useQuery(api.games.getCategoriesWithDescriptions);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/10 w-full max-w-2xl max-h-[80vh]">
        <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">شرح التصنيفات</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-65px)]">
          {categories === undefined && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          )}
          {categories && categories.length > 0 ? (
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-white/5 border border-white/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-purple-300">{cat.name}</h3>
                  <p className="text-gray-300 mt-1">{cat.description || "لا يوجد وصف"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-12">لا توجد تصنيفات لعرضها.</p>
          )}
        </div>
      </div>
    </div>
  );
}
