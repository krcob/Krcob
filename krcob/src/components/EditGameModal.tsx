import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface EditGameModalProps {
  game: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditGameModal({ game, onClose, onSuccess }: EditGameModalProps) {
  const [title, setTitle] = useState(game.title);
  const [description, setDescription] = useState(game.description);
  const [videoUrl, setVideoUrl] = useState(game.videoUrl || "");
  const [additionalVideos, setAdditionalVideos] = useState<string[]>(
    game.additionalVideos && game.additionalVideos.length > 0 ? game.additionalVideos : [""]
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(game.categories || []);
  const [imageUrl, setImageUrl] = useState(game.imageUrl || "");
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    game.additionalImages && game.additionalImages.length > 0 ? game.additionalImages : [""]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateGame = useMutation(api.games.update);
  const categories = useQuery(api.games.getCategories);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addVideoField = () => {
    setAdditionalVideos(prev => [...prev, ""]);
  };

  const removeVideoField = (index: number) => {
    setAdditionalVideos(prev => prev.filter((_, i) => i !== index));
  };

  const updateVideoField = (index: number, value: string) => {
    setAdditionalVideos(prev => prev.map((url, i) => i === index ? value : url));
  };

  const addImageField = () => {
    setAdditionalImages(prev => [...prev, ""]);
  };

  const removeImageField = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateImageField = (index: number, value: string) => {
    setAdditionalImages(prev => prev.map((url, i) => i === index ? value : url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || selectedCategories.length === 0) {
      toast.error("يرجى ملء الحقول المطلوبة واختيار تصنيف واحد على الأقل");
      return;
    }

    if (!imageUrl.trim()) {
      toast.error("يجب إضافة رابط الصورة الرئيسية");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateGame({
        id: game._id,
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim() || undefined,
        additionalVideos: additionalVideos.filter(url => url.trim()),
        categories: selectedCategories,
        imageUrl: imageUrl.trim(),
        additionalImages: additionalImages.filter(url => url.trim()),
      });
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تحديث اللعبة");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categories === undefined) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">تعديل اللعبة</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-200 font-medium mb-2">
              اسم اللعبة *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
              placeholder="أدخل اسم اللعبة"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-2">
              التصنيفات * (يمكن اختيار أكثر من تصنيف)
            </label>
            {categories.length === 0 ? (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-yellow-200">
                <p className="text-sm">
                  لا توجد تصنيفات متاحة. يرجى إضافة تصنيفات أولاً من خلال "إدارة التصنيفات".
                </p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/20 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-white">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {selectedCategories.length > 0 && (
              <div className="mt-2 text-sm text-purple-200">
                تم اختيار {selectedCategories.length} تصنيف
              </div>
            )}
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-2">
              رابط الصورة الرئيسية *
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
              placeholder="https://example.com/image.jpg"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              * الصورة الرئيسية مطلوبة وستظهر في الصفحة الرئيسية وكخلفية للعبة
            </p>
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-2">
              صور إضافية (اختياري)
            </label>
            <div className="space-y-2">
              {additionalImages.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImageField(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
                    placeholder="https://example.com/additional-image.jpg"
                  />
                  {additionalImages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                + إضافة صورة أخرى
              </button>
            </div>
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-2">
              رابط الفيديو الرئيسي (YouTube) - اختياري
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-2">
              فيديوهات إضافية (YouTube) - اختياري
            </label>
            <div className="space-y-2">
              {additionalVideos.map((video, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={video}
                    onChange={(e) => updateVideoField(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {additionalVideos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVideoField(index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addVideoField}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                + إضافة فيديو آخر
              </button>
            </div>
          </div>

          <div>
            <label className="block text-purple-200 font-medium mb-2">
              وصف اللعبة *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all resize-none"
              placeholder="اكتب وصفاً مختصراً عن اللعبة..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || categories.length === 0}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isSubmitting ? "جاري التحديث..." : "تحديث اللعبة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
