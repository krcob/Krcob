import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AddGameFormProps {
  onSuccess: () => void;
}

export function AddGameForm({ onSuccess }: AddGameFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [additionalVideos, setAdditionalVideos] = useState<string[]>([""]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addGame = useMutation(api.games.add);
  
  // تعديل: جلب جميع التاقات بدلاً من الكاتيجوري فقط للحصول على الـ group
  const allTags = useQuery(api.tags.list);

  // تقسيم التاقات إلى مجموعات بناءً على الـ group
  const playStyleTags = allTags?.filter(t => t.group === "نمط اللعب") || [];
  const connectionTags = allTags?.filter(t => t.group === "نوع الاتصال") || [];

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
      await addGame({
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim() || undefined,
        additionalVideos: additionalVideos.filter(url => url.trim()),
        categories: selectedCategories,
        imageUrl: imageUrl.trim(),
        additionalImages: additionalImages.filter(url => url.trim()),
      });
      
      toast.success("تم إضافة اللعبة بنجاح!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setAdditionalVideos([""]);
      setSelectedCategories([]);
      setImageUrl("");
      setAdditionalImages([""]);
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إضافة اللعبة");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (allTags === undefined) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">إضافة لعبة جديدة</h3>
      
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

        {/* --- بداية تعديل التصنيفات المقسمة --- */}
        <div className="space-y-4">
          <label className="block text-purple-200 font-medium">التصنيفات *</label>
          
          {/* قسم نمط اللعب */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <span className="block text-xs font-bold text-purple-400 uppercase mb-3">نمط اللعب</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {playStyleTags.map((tag) => (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleCategory(tag.name)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedCategories.includes(tag.name)
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* قسم نوع الاتصال */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <span className="block text-xs font-bold text-blue-400 uppercase mb-3">نوع الاتصال</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {connectionTags.map((tag) => (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleCategory(tag.name)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedCategories.includes(tag.name)
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* --- نهاية تعديل التصنيفات المقسمة --- */}

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

        <button
          type="submit"
          disabled={isSubmitting || allTags.length === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {isSubmitting ? "جاري الإضافة..." : "إضافة اللعبة"}
        </button>
      </form>
    </div>
  );
}
