import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { EditGameModal } from "./EditGameModal";
import { TagWithDescription } from "./TagWithDescription";
import { CategoriesInfoModal } from "./CategoriesInfoModal";
import { GameDetailsModal } from "./GameDetailsModal";
import { Id } from "../../convex/_generated/dataModel";

export function GamesList() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const [editingGame, setEditingGame] = useState<any>(null);
  const [showCategoriesInfo, setShowCategoriesInfo] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<Id<"games"> | null>(null);
  
  const games = useQuery(api.games.list, { 
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    searchQuery: actualSearchQuery.trim() || undefined
  });
  const categoriesWithDescriptions = useQuery(api.games.getCategoriesWithDescriptions);
  const removeGame = useMutation(api.games.remove);
  const isAdmin = useQuery(api.games.checkAdminStatus);

  const handleRemoveGame = async (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the game details modal
    if (confirm("هل أنت متأكد من حذف هذه اللعبة؟")) {
      try {
        await removeGame({ id: gameId as any });
        toast.success("تم حذف اللعبة بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء حذف اللعبة");
      }
    }
  };

  const handleEditGame = (game: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the game details modal
    setEditingGame(game);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActualSearchQuery(searchQuery);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setActualSearchQuery(searchQuery);
    }
  };

  const handleGameClick = (gameId: Id<"games">) => {
    setSelectedGameId(gameId);
  };

  if (games === undefined || categoriesWithDescriptions === undefined || isAdmin === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">البحث في الألعاب</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            placeholder="ابحث عن اسم اللعبة واضغط Enter..."
            className="w-full px-4 py-3 pr-12 pl-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
          <button
            type="submit"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            بحث
          </button>
        </form>
        {actualSearchQuery && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-purple-200">البحث عن: "{actualSearchQuery}"</span>
            <button
              onClick={() => {
                setActualSearchQuery("");
                setSearchQuery("");
              }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              ✕ مسح
            </button>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            تصفية حسب التصنيف
            {isAdmin && (
              <span className="text-sm text-purple-200 font-normal mr-2">
                (اضغط مرتين على التصنيف لرؤية الوصف)
              </span>
            )}
          </h3>
          <button
            onClick={() => setShowCategoriesInfo(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            معنى التصنيفات
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategories([])}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategories.length === 0
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white/10 text-purple-200 hover:bg-white/20"
            }`}
          >
            جميع الألعاب
          </button>
          {categoriesWithDescriptions.map((tag) => (
            <TagWithDescription
              key={tag._id}
              name={tag.name}
              description={tag.description}
              isSelected={selectedCategories.includes(tag.name)}
              onClick={() => toggleCategory(tag.name)}
              showDoubleClickHint={isAdmin}
            />
          ))}
        </div>
        {selectedCategories.length > 0 && (
          <div className="mt-3 text-sm text-purple-200">
            التصنيفات المحددة: {selectedCategories.length}
          </div>
        )}
      </div>

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-2xl font-bold text-white mb-2">لا توجد ألعاب</h3>
          <p className="text-purple-200">
            {actualSearchQuery 
              ? `لا توجد نتائج للبحث عن "${actualSearchQuery}"`
              : selectedCategories.length > 0
              ? "لا توجد ألعاب في التصنيفات المحددة"
              : "لا توجد ألعاب حالياً"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            // Count total media
            const totalImages = 1 + (game.additionalImages?.length || 0);
            const totalVideos = (game.videoUrl ? 1 : 0) + (game.additionalVideos?.length || 0);
            
            return (
              <div
                key={game._id}
                onClick={() => handleGameClick(game._id)}
                className="bg-black/30 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer group"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🎮</span>
                    </div>
                  )}
                  
                  {/* Overlay with click hint */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <span className="text-white font-medium text-sm">اضغط لعرض التفاصيل</span>
                    </div>
                  </div>

                  {/* Media indicators */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {totalVideos > 0 && (
                      <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <span>📹</span>
                        <span>{totalVideos}</span>
                      </div>
                    )}
                    {totalImages > 1 && (
                      <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <span>🖼️</span>
                        <span>{totalImages}</span>
                      </div>
                    )}
                  </div>

                  {/* Update indicator */}
                  {game.updatedAt && (
                    <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">
                      محدث
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white line-clamp-2">
                      {game.title}
                    </h3>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleEditGame(game, e)}
                          className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                          title="تعديل اللعبة"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => handleRemoveGame(game._id, e)}
                          className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                          title="حذف اللعبة"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3 flex flex-wrap gap-1">
                    {game.categories.map((category, index) => {
                      const tagData = categoriesWithDescriptions.find(tag => tag.name === category);
                      return (
                        <TagWithDescription
                          key={index}
                          name={category}
                          description={tagData?.description}
                          className="inline-block bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full text-xs font-medium"
                          showDoubleClickHint={isAdmin}
                        />
                      );
                    })}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {game.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>بواسطة: {game.createdByName || "مدير"}</span>
                    <span>{new Date(game._creationTime).toLocaleDateString('ar-SA')}</span>
                  </div>
                  
                  {/* Update info */}
                  {game.updatedAt && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-xs text-yellow-300">
                      <span>آخر تحديث: {game.updatedByName || "مدير"}</span>
                      <span>{new Date(game.updatedAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Game Details Modal */}
      {selectedGameId && (
        <GameDetailsModal
          gameId={selectedGameId}
          onClose={() => setSelectedGameId(null)}
        />
      )}

      {/* Edit Modal */}
      {editingGame && (
        <EditGameModal
          game={editingGame}
          onClose={() => setEditingGame(null)}
          onSuccess={() => {
            setEditingGame(null);
            toast.success("تم تحديث اللعبة بنجاح");
          }}
        />
      )}

      {/* Categories Info Modal */}
      {showCategoriesInfo && (
        <CategoriesInfoModal onClose={() => setShowCategoriesInfo(false)} />
      )}
    </div>
  );
}
