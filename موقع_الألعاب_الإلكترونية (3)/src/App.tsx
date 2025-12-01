import { useState } from "react";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { Toaster } from "sonner";
import { GamesList } from "./components/GamesList";
import { AddGameForm } from "./components/AddGameForm";
import { TagManagement } from "./components/TagManagement";
import { AdminLoginModal } from "./components/AdminLoginModal";

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  const isAdmin = useQuery(api.games.checkAdminStatus);
  const adminName = useQuery(api.games.getCurrentAdminName);
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    void signOut();
    setShowAdminPanel(false);
  };

  return (
    <>
      <Toaster position="bottom-center" theme="dark" />
      <div className="min-h-screen bg-gray-900 text-white font-sans bg-grid">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <header className="text-center mb-8 relative">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text pb-2">
              مكتبة الألعاب
            </h1>
            <p className="text-purple-200">
              استكشف، ابحث، وشارك الألعاب المفضلة لديك
            </p>
            
            {/* Admin Login Button */}
            <div className="absolute top-0 left-0">
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="text-2xl p-2 rounded-full hover:bg-white/10 transition-colors"
                title="تسجيل دخول المدير"
              >
                🔒
              </button>
            </div>
          </header>

          {/* Admin Welcome & Panel Toggle */}
          {isAdmin && (
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10 flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">
                  مرحباً أيها المدير, <span className="text-purple-300">{adminName}</span>!
                </p>
                <p className="text-sm text-gray-400">
                  يمكنك الآن إدارة الألعاب والتصنيفات.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {showAdminPanel ? "إخفاء لوحة التحكم" : "إظهار لوحة التحكم"}
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                  title="تسجيل الخروج كمدير"
                >
                  خروج
                </button>
              </div>
            </div>
          )}

          {/* Admin Panel */}
          {isAdmin && showAdminPanel && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <AddGameForm />
              <TagManagement />
            </div>
          )}

          <main>
            <GamesList />
          </main>

          {/* Footer */}
          <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>تم التطوير بواسطة Krcob</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="https://discord.gg/AQyKaJ6MsZ" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300">Discord</a>
              <a href="https://www.youtube.com/@krcob" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300">YouTube</a>
            </div>
          </footer>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} />
      )}
    </>
  );
}

export default App;
