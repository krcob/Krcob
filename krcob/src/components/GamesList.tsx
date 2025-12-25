import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { EditGameModal } from "./EditGameModal";
import { GameDetailsModal } from "./GameDetailsModal";
import { TagsInfoModal } from "./TagsInfoModal"; // تأكد من وجود هذا الملف أو استبدله بالاسم الصحيح للنافذة
import { Id } from "../../convex/_generated/dataModel";
import { getGroupTheme } from "../lib/utils";

export function GamesList() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const [editingGame, setEditingGame] = useState<any>(null);
  const [selectedGameId, setSelectedGameId] = useState<Id<"games"> | null>(null);
  const [showTagsInfo, setShowTagsInfo] = useState(false); // الحالة الجديدة لفتح النافذة
  
  const games = useQuery(api.games.list, { 
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    searchQuery: actualSearchQuery.trim() || undefined
  });
  const categoriesWithDescriptions = useQuery(api.games.getCategoriesWithDescriptions);
  const isAdmin = useQuery(api.games.checkAdminStatus);

  const groupedCategories = useMemo(() => {
    if (!categoriesWithDescriptions) return {};
    return categoriesWithDescriptions.reduce((acc: any, tag) => {
      const group = tag.group || "أخرى";
      if (!acc[group]) acc[group] = [];
      acc[group].push(tag);
      return acc;
    }, {});
  }, [categoriesWithDescriptions]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  if (games === undefined || categoriesWithDescriptions === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* 1. شريط البحث */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl">
        <form onSubmit={(e) => { e.preventDefault(); setActualSearchQuery(searchQuery); }} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن تحدي جديد..."
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500/50 focus:ring-0 outline-none transition-all"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-black transition-all">بحث</button>
        </form>
      </div>

      {/* 2. قسم التصفية الذكية */}
      <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl relative">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-black text-white flex items-center gap-3">
              <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400 text-sm">⚡</span>
              تصفية ذكية
            </h3>

            {/* الزر الآن يقوم بفتح النافذة برمجياً بدلاً من تغيير الرابط */}
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTagsInfo(true); // يفتح النافذة فوراً
              }}
              className="flex items-center gap-2 bg-[#6b21a8] hover:bg-[#7e22ce] text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-all shadow-lg border border-purple-500/30 cursor-pointer"
            >
              <span className="bg-white/20 w-5 h-5 flex items-center justify-center rounded-full text-[10px]">؟</span>
              معنى التصنيفات
            </button>
          </div>
          
          {selectedCategories.length > 0 && (
            <button 
              onClick={() => setSelectedCategories([])} 
              className="text-[10px] font-black text-red-400 bg-red-400/10 px-4 py-2 rounded-lg hover:bg-red-400 hover:text-white transition-all border border-red-400/20"
            >
              إلغاء الفلاتر ✕
            </button>
          )}
        </div>

        {/* شبكة التصنيفات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedCategories).map(([groupName, tags]: [string, any]) => {
            const theme = getGroupTheme(groupName);
            return (
              <div key={groupName} className="space-y-4">
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.text} mb-2 flex items-center gap-2`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.bg}`}></span>
                  {groupName.split(' (')[0]}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <button
                      key={tag._id}
                      onClick={() => toggleCategory(tag.name)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all border ${
                        selectedCategories.includes(tag.name)
                          ? `${theme.bg} border-transparent text-white ${theme.shadow} scale-105`
                          : `bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10`
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. عرض الألعاب */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <div
            key={game._id}
            onClick={() => setSelectedGameId(game._id)}
            className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-xl"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-4 right-4 flex flex-wrap gap-1">
                {game.categories.slice(0, 3).map((cat: string) => {
                  const tagInfo = categoriesWithDescriptions?.find(t => t.name === cat);
                  const theme = getGroupTheme(tagInfo?.group || "");
                  return (
                    <span key={cat} className={`px-2 py-0.5 rounded text-[9px] font-black text-white ${theme.bg} backdrop-blur-md shadow-sm`}>
                      {cat}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">{game.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-6">{game.description}</p>
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <span className="text-[10px] text-gray-500 font-bold">📅 {new Date(game._creationTime).toLocaleDateString('ar-SA')}</span>
                <span className="text-[10px] text-purple-400 font-black">التفاصيل ←</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* النوافذ المنبثقة */}
      {selectedGameId && <GameDetailsModal gameId={selectedGameId} onClose={() => setSelectedGameId(null)} />}
      {editingGame && <EditGameModal game={editingGame} onClose={() => setEditingGame(null)} onSuccess={() => setEditingGame(null)} />}
      
      {/* استدعاء نافذة معاني التصنيفات عند الضغط على الزر الجديد */}
      {showTagsInfo && <TagsInfoModal onClose={() => setShowTagsInfo(false)} />}
    </div>
  );
}
