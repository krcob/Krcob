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
    <main className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a] text-white">
      <Toaster position="top-center" richColors />
      
      <AuthLoading>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </AuthLoading>
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar */}
        <div className="mb-12">
          <div className="flex justify-start gap-3 flex-wrap mb-10 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            
            {/* زر الصفحة الرئيسية */}
            <button
              onClick={() => setActiveTab("games")}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 text-sm ${
                activeTab === "games" 
                ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                : "hover:bg-white/10 text-gray-300"
              }`}
            >
              🏠 <span className="hidden sm:inline">الرئيسية</span>
            </button>

            {/* زر ديسكورد باللون الرسمي */}
            <button
              onClick={openDiscord}
              className="bg-[#5865F2] hover:bg-[#4752C4] hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 text-sm shadow-lg"
            >
              <span className="text-lg">🎮</span> <span className="hidden md:inline">ديسكورد</span>
            </button>

            {/* زر يوتيوب باللون الرسمي */}
            <button
              onClick={openYouTube}
              className="bg-[#FF0000] hover:bg-[#CC0000] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 text-sm shadow-lg"
            >
              <span className="text-lg">🎬</span> <span className="hidden md:inline">يوتيوب</span>
            </button>

            {/* زر الدعم المالي */}
            <button
              onClick={openSupport}
              className="bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 text-sm shadow-lg"
            >
              <span className="text-lg">💰</span> <span className="hidden md:inline">ادعمنا</span>
            </button>

            {/* زر معنى التصنيفات */}
            <button
              onClick={() => setActiveTab("tags-info")}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 text-sm border ${
                activeTab === "tags-info" 
                ? "bg-purple-600 border-transparent shadow-[0_0_20px_rgba(147,51,234,0.4)]" 
                : "bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20"
              }`}
            >
              ❓ <span className="hidden sm:inline">التصنيفات</span>
            </button>
            
            <div className="flex-grow"></div>

            <Unauthenticated>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl font-bold transition-all text-sm flex items-center gap-2"
              >
                🔐 <span className="hidden sm:inline">الإدارة</span>
              </button>
            </Unauthenticated>
            
            <Authenticated>
              <SignOutButton />
            </Authenticated>
          </div>

          {/* العنوان الرئيسي بتصميم فخم */}
          <div className="text-center group cursor-pointer" onClick={() => setActiveTab("games")}>
            <div className="inline-block p-4 rounded-3xl bg-gradient-to-b from-purple-500/20 to-transparent mb-4 border border-purple-500/10 group-hover:border-purple-500/30 transition-all">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                K R C O B
              </h1>
            </div>
            <p className="text-gray-400 font-medium tracking-[0.3em] uppercase text-xs">Gaming Library • مكتبة الألعاب</p>
          </div>
        </div>

        {/* أزرار لوحة التحكم للآدمين */}
        <Authenticated>
          {isAdmin && (
            <div className="flex justify-center mb-12">
              <div className="bg-[#111] p-1.5 rounded-2xl border border-white/5 flex gap-1">
                {["games", "add", "tags"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                      activeTab === tab 
                      ? "bg-purple-600 text-white shadow-lg" 
                      : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {tab === "games" ? "المكتبة" : tab === "add" ? "إضافة" : "التصنيفات"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Authenticated>

        {/* محتوى الصفحة */}
        <div className="mt-8 transition-all duration-500">
          {activeTab === "games" && <GamesList onOpenTagsInfo={() => setActiveTab("tags-info")} />}
          {activeTab === "tags-info" && <TagsInfo />}
          
          <Authenticated>
            {activeTab === "add" && isAdmin && <AddGameForm onSuccess={() => setActiveTab("games")} />}
            {activeTab === "tags" && isAdmin && <TagManagement />}
          </Authenticated>
        </div>
      </div>

      {showAdminLogin && <AdminLoginModal onClose={() => setShowAdminLogin(false)} />}
    </main>
  );
}

export default App;
