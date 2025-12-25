import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignOutButton } from "./SignOutButton";
import { GamesList } from "./components/GamesList";
import { AddGameForm } from "./components/AddGameForm";
import { TagManagement } from "./components/TagManagement";
import { AdminLoginModal } from "./components/AdminLoginModal";
import TagsInfo from "./components/TagsInfo"; 
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";

function App() {
  const [activeTab, setActiveTab] = useState<"games" | "add" | "tags" | "tags-info">("games");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const isAdmin = useQuery(api.games.checkAdminStatus);

  const openDiscord = () => window.open('https://discord.gg/AQyKaJ6MsZ', '_blank');
  const openYouTube = () => window.open('https://www.youtube.com/@krcob', '_blank');
  const openSupport = () => window.open('https://streamlabs.com/krcob/tip', '_blank');

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Toaster position="top-center" richColors />
      
      <AuthLoading>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      </AuthLoading>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* الأزرار العلوية المحدثة */}
          <div className="flex justify-start gap-3 flex-wrap mb-6">
            
            {/* زر الصفحة الرئيسية الجديد */}
            <button
              onClick={() => setActiveTab("games")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center gap-2 text-sm ${
                activeTab === "games" 
                ? "bg-white text-purple-900" 
                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
              }`}
            >
              🏠 الصفحة الرئيسية
            </button>

            <button
              onClick={openDiscord}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              <span>🎮</span> حياك! العب معنا
            </button>

            <button
              onClick={openYouTube}
              className="bg-[#FF0000] hover:bg-[#CC0000] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              <span>🎬</span> قناة اليوتيوب
            </button>

            <button
              onClick={openSupport}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              <span>💰</span> ادعمنا
            </button>

            <button
              onClick={() => setActiveTab("tags-info")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center gap-2 text-sm ${
                activeTab === "tags-info" 
                ? "bg-white text-purple-900" 
                : "bg-purple-500/20 text-purple-200 hover:bg-purple-500/40 border border-purple-500/30"
              }`}
            >
              ❓ معنى التصنيفات
            </button>
            
            <Unauthenticated>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg text-sm"
              >
                🔐 
              </button>
            </Unauthenticated>
            
            <Authenticated>
              <SignOutButton />
            </Authenticated>
          </div>

          {/* العنوان الرئيسي - جعله يوجه للرئيسية أيضاً عند الضغط */}
          <div className="text-center cursor-pointer" onClick={() => setActiveTab("games")}>
            <h1 className="text-4xl font-bold text-white mb-2">🎮 مكتبة الألعاب</h1>
            <p className="text-purple-200">اكتشف وشارك أفضل الألعاب</p>
          </div>
        </div>

        {/* أزرار التحكم للمسؤول فقط */}
        <Authenticated>
          {isAdmin && (
            <div className="flex justify-center mb-8">
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-2 border border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("games")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === "games" ? "bg-purple-600 text-white shadow-lg" : "text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    عرض الألعاب
                  </button>
                  <button
                    onClick={() => setActiveTab("add")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === "add" ? "bg-purple-600 text-white shadow-lg" : "text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    إضافة لعبة
                  </button>
                  <button
                    onClick={() => setActiveTab("tags")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === "tags" ? "bg-purple-600 text-white shadow-lg" : "text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    إدارة التصنيفات
                  </button>
                </div>
              </div>
            </div>
          )}
        </Authenticated>

        {/* عرض المحتوى بناءً على التبويب النشط */}
        <div className="mt-8">
          {activeTab === "games" && <GamesList onOpenTagsInfo={() => setActiveTab("tags-info")} />}
          {activeTab === "tags-info" && <TagsInfo />}
          
          <Authenticated>
            {activeTab === "add" && isAdmin && (
              <AddGameForm onSuccess={() => setActiveTab("games")} />
            )}
            {activeTab === "tags" && isAdmin && <TagManagement />}
          </Authenticated>
        </div>
      </div>

      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}
    </main>
  );
}

export default App;
