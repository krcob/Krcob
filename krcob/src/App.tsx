import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignOutButton } from "./SignOutButton";
import { GamesList } from "./components/GamesList";
import { AddGameForm } from "./components/AddGameForm";
import { TagManagement } from "./components/TagManagement";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";

function App() {
  const [activeTab, setActiveTab] = useState<"games" | "add" | "tags">("games");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const isAdmin = useQuery(api.games.checkAdminStatus);

  const openDiscord = () => {
    window.open('https://discord.gg/AQyKaJ6MsZ', '_blank');
  };

  const openYouTube = () => {
    window.open('https://www.youtube.com/@krcob', '_blank');
  };

  const openSupport = () => {
    window.open('https://streamlabs.com/krcob/tip', '_blank');
  };

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
          {/* Top Buttons Row */}
          <div className="flex justify-start gap-3 flex-wrap mb-6">
            <button
              onClick={openDiscord}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              حياك! العب معنا
            </button>

            <button
              onClick={openYouTube}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              قناة اليوتيوب
            </button>

            <button
              onClick={openSupport}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              ادعمنا
            </button>
            
            <Unauthenticated>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            </Unauthenticated>
            
            <Authenticated>
              <SignOutButton />
            </Authenticated>
          </div>

          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">🎮 مكتبة الألعاب</h1>
            <p className="text-purple-200">اكتشف وشارك أفضل الألعاب</p>
          </div>
        </div>

        {/* Navigation Tabs - Only show for authenticated admins */}
        <Authenticated>
          {isAdmin && (
            <div className="flex justify-center mb-8">
              <div className="bg-black/20 backdrop-blur-md rounded-xl p-2 border border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("games")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === "games"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    عرض الألعاب
                  </button>
                  <button
                    onClick={() => setActiveTab("add")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === "add"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    إضافة لعبة
                  </button>
                  <button
                    onClick={() => setActiveTab("tags")}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === "tags"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    إدارة التصنيفات
                  </button>
                </div>
              </div>
            </div>
          )}
        </Authenticated>

        {/* Content */}
        <Authenticated>
          {activeTab === "games" && <GamesList />}
          {activeTab === "add" && isAdmin && (
            <AddGameForm onSuccess={() => setActiveTab("games")} />
          )}
          {activeTab === "tags" && isAdmin && <TagManagement />}
        </Authenticated>
        
        <Unauthenticated>
          <GamesList />
        </Unauthenticated>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}
    </main>
  );
}

export default App;
