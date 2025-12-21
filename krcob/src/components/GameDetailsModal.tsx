import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface GameDetailsModalProps {
  gameId: Id<"games">;
  onClose: () => void;
}

export function GameDetailsModal({ gameId, onClose }: GameDetailsModalProps) {
  const game = useQuery(api.games.getById, { id: gameId });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openDiscord = () => {
    window.open('https://discord.gg/AQyKaJ6MsZ', '_blank');
  };

  if (game === undefined) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-md w-full text-center">
          <h3 className="text-xl font-bold text-white mb-4">اللعبة غير موجودة</h3>
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  const extractVideoId = (url: string) => {
    // Support for various YouTube URL formats including Shorts
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,           // Standard watch URLs
      /(?:youtu\.be\/)([^&\n?#]+)/,                       // Short URLs
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,             // Embed URLs
      /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,            // YouTube Shorts
      /(?:youtube\.com\/v\/)([^&\n?#]+)/,                 // Old format
      /(?:youtube\.com\/.*[?&]v=)([^&\n?#]+)/             // Any URL with v parameter
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const openYouTube = (url: string) => {
    window.open(url, '_blank');
  };

  // Combine main image with additional images
  const allImages = [game.imageUrl, ...(game.additionalImages || [])].filter(Boolean);
  
  // Combine main video with additional videos
  const allVideos = [game.videoUrl, ...(game.additionalVideos || [])].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{game.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Images Section */}
          {allImages.length > 0 && (
            <div className="mb-6">
              <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden mb-4">
                <img
                  src={allImages[selectedImageIndex]}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? "border-purple-400 shadow-lg" 
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${game.title} - صورة ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Game Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-white mb-3">وصف اللعبة</h3>
                <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {game.description}
                  </p>
                </div>
              </div>

              {/* YouTube Videos Section */}
              {allVideos.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    مقاطع الفيديو ({allVideos.length})
                  </h3>
                  <div className="space-y-4">
                    {allVideos.map((videoUrl, index) => {
                      if (!videoUrl) return null;
                      const videoId = extractVideoId(videoUrl);
                      if (!videoId) return null;
                      
                      return (
                        <div key={index} className="bg-white/5 border border-white/20 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg font-semibold text-white">
                              {index === 0 ? "الفيديو الرئيسي" : `فيديو إضافي ${index}`}
                            </h4>
                            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                              YouTube
                            </span>
                          </div>
                          <div 
                            className="aspect-video rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center relative cursor-pointer group"
                            onClick={() => videoUrl && openYouTube(videoUrl)}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                              alt={`${game.title} - فيديو ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                              <div className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl group-hover:scale-110">
                                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 text-center">
                            <button
                              onClick={() => videoUrl && openYouTube(videoUrl)}
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                              مشاهدة على YouTube
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">التصنيفات</h3>
                <div className="flex flex-wrap gap-2">
                  {game.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Media Count */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">الوسائط</h3>
                <div className="bg-white/5 border border-white/20 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">الصور:</span>
                    <span className="text-white text-sm font-medium">{allImages.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">الفيديوهات:</span>
                    <span className="text-white text-sm font-medium">{allVideos.length}</span>
                  </div>
                </div>
              </div>

              {/* Game Info */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">معلومات اللعبة</h3>
                <div className="bg-white/5 border border-white/20 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">أضيفت بواسطة:</span>
                    <span className="text-white text-sm font-medium">{game.createdByName || "مدير"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">تاريخ الإضافة:</span>
                    <span className="text-white text-sm">
                      {new Date(game._creationTime).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">الوقت:</span>
                    <span className="text-white text-sm">
                      {new Date(game._creationTime).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {/* Update Information */}
                  {game.updatedAt && (
                    <>
                      <hr className="border-white/10" />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">آخر تحديث بواسطة:</span>
                        <span className="text-yellow-300 text-sm font-medium">{game.updatedByName || "مدير"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">تاريخ التحديث:</span>
                        <span className="text-yellow-300 text-sm">
                          {new Date(game.updatedAt).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">وقت التحديث:</span>
                        <span className="text-yellow-300 text-sm">
                          {new Date(game.updatedAt).toLocaleTimeString('ar-SA', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {allVideos.length > 0 && allVideos[0] && (
                  <button
                    onClick={() => allVideos[0] && openYouTube(allVideos[0])}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>مشاهدة الفيديو الرئيسي</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </button>
                )}
                
                {/* Discord Button */}
                <button
                  onClick={openDiscord}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  للنقاش والاستفسار
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
