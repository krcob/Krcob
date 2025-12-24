import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useMemo } from "react";
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

  // تنظيم التاقات في مجموعات برمجياً لسهولة العرض
  const groupedCategories = useMemo(() => {
    if (!categoriesWithDescriptions) return {};
    return categoriesWithDescriptions.reduce((acc: any, tag) => {
      const group = tag.group || "تصنيفات أخرى";
      if (!acc[group]) acc[group] = [];
      acc[group].push(tag);
      return acc;
    }, {});
  }, [categoriesWithDescriptions]);

  const handleRemoveGame = async (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
    e.stopPropagation();
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

  const filteredGames = games.filter((game) => {
    if (selectedCategories.length === 0) return true;
    return selectedCategories.every((selectedCat) => 
      game.categories.includes(selectedCat)
    );
  });

  return (
    <div className="space-y-6" dir="rtl">
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
            className="w-full px-4 py-3 pr-4 pl-20 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-sm transition-colors font-bold"
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
              ✕ مسح البحث
            </button>
          </div>
        )}
      </div>

      {/* Category Filter - Organized by Groups */}
      <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🏷️</span> 
            تصفية متقدمة
          </h3>
          <div className="flex gap-2">
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg font-bold transition-all text-sm hover:bg-red-500/30"
              >
                مسح التصنيفات
              </button>
            )}
            <button
              onClick={() => setShowCategoriesInfo(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
            >
              معنى التصنيفات
            </button>
          </div>
        </div>

        {/* عرض المجموعات المقسمة */}
        <div className="space-y-8">
          {Object.entries(groupedCategories).map(([groupName, tags]: [string, any]) => (
            <div key={groupName} className="group-section">
              <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2 opacity-80 uppercase tracking-widest">
                <span className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]"></span>
                {groupName}
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: any) => (
                  <TagWithDescription
                    key={tag._id}
                    name={tag.name}
                    description={tag.description}
                    isSelected={selectedCategories.includes(tag.name)}
                    onClick={() => toggleCategory(tag.name)}
                    showDoubleClickHint={isAdmin}
                    className={`transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                      selectedCategories.includes(tag.name)
                        ? "!bg-purple-600 !text-white !border-purple-400 shadow-lg"
                        : "!bg-white/5 !text-purple-200/70 !border-white/5 hover:!border-purple-500/30 hover:!bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-20 bg-black/10 rounded-xl border border-dashed border-white/10">
          <div className="text-6xl mb-4 opacity-50">🎮</div>
          <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج</h3>
          <p className="text-purple-200 opacity-70">
            جرب تغيير معايير البحث أو مسح التصنيفات المختارة
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const totalImages = 1 + (game.additionalImages?.length || 0);
            const totalVideos = (game.videoUrl ? 1 : 0) + (game.additionalVideos?.length || 0);
            
            return (
              <div
                key={game._id}
                onClick={() => handleGameClick(game._id)}
                className="bg-black/30 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer group"
              >
                {/* Image Section */}
                <div className="aspect-video bg-gray-800 relative overflow-hidden">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">🎮</div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <span className="text-white font-bold text-sm bg-purple-600/80 px-4 py-2 rounded-full backdrop-blur-sm">عرض التفاصيل</span>
                  </div>

                  <div className="absolute top-2 right-2 flex gap-1">
                    {totalVideos > 0 && (
                      <div className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-lg">
                        <span>📹</span> {totalVideos}
                      </div>
                    )}
                    {totalImages > 1 && (
                      <div className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-lg">
                        <span>🖼️</span> {totalImages}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {game.title}
                    </h3>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button onClick={(e) => handleEditGame(game, e)} className="hover:scale-125 transition-transform">✏️</button>
                        <button onClick={(e) => handleRemoveGame(game._id, e)} className="hover:scale-125 transition-transform">🗑️</button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3 flex flex-wrap gap-1">
                    {game.categories.map((category: string, index: number) => (
                      <span key={index} className="bg-purple-600/20 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-medium">
                        {category}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-gray-400 text-xs mb-4 line-clamp-2 h-8">
                    {game.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-[10px] text-gray-500 pt-3 border-t border-white/5">
                    <span>👤 {game.createdByName || "مدير"}</span>
                    <span>📅 {new Date(game._creationTime).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {selectedGameId && (
        <GameDetailsModal gameId={selectedGameId} onClose={() => setSelectedGameId(null)} />
      )}

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

      {showCategoriesInfo && (
        <CategoriesInfoModal onClose={() => setShowCategoriesInfo(false)} />
      )}
    </div>
  );
}
