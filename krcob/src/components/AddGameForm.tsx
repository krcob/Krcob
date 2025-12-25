import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
// التصحيح: استخدام نقطتين فقط للوصول لمجلد lib من داخل مكونات src
import { getGroupTheme } from "../lib/utils";

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
  const allTags = useQuery(api.tags.list); // جلب التاقات من جدول التاقات

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addVideoField = () => setAdditionalVideos(prev => [...prev, ""]);
  const removeVideoField = (index: number) => setAdditionalVideos(prev => prev.filter((_, i) => i !== index));
  const updateVideoField = (index: number, value: string) => setAdditionalVideos(prev => prev.map((url, i) => i === index ? value : url));

  const addImageField = () => setAdditionalImages(prev => [...prev, ""]);
  const removeImageField = (index: number) => setAdditionalImages(prev => prev.filter((_, i) => i !== index));
  const updateImageField = (index: number, value: string) => setAdditionalImages(prev => prev.map((url, i) => i === index ? value : url));

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

  // تصفية التاقات حسب المجموعات الخمس
  const genreTags = allTags.filter(t => t.group === "أنواع الألعاب (Genres)");
  const playStyleTags = allTags.filter(t => t.group === "نمط اللعب والاتصال (Play Style)");
  const platformTags = allTags.filter(t => t.group === "المنصات والأجهزة (Platforms)");
  const storeTags = allTags.filter(t => t.group === "المتاجر والوصول (Stores & Access)");
  const visualTags = allTags.filter(t => t.group === "الأبعاد والمنظور (Visuals & Perspective)");

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-2xl">
      <h3 className="text-2xl font-black text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        إضافة لعبة جديدة للمنصة
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* معلومات اللعبة الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase mb-2 mr-1">اسم اللعبة *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600"
              placeholder="مثال: Elden Ring"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-[10px] font-black uppercase mb-2 mr-1">رابط الصورة الرئيسية *</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600"
              placeholder="https://..."
              required
            />
          </div>
        </div>

        {/* قسم التصنيفات الذكية */}
        <div className="space-y-4">
          <label className="block text-purple-400 text-xs font-black uppercase tracking-widest mb-4">اختيار التصنيفات *</label>
          <div className="grid grid-cols-1 gap-4">
            <TagGroupSection title="أنواع الألعاب" groupName="أنواع الألعاب (Genres)" tags={genreTags} selected={selectedCategories} onToggle={toggleCategory} />
            <TagGroupSection title="نمط اللعب والاتصال" groupName="نمط اللعب والاتصال (Play Style)" tags={playStyleTags} selected={selectedCategories} onToggle={toggleCategory} />
            <TagGroupSection title="الأبعاد والمنظور" groupName="الأبعاد والمنظور (Visuals & Perspective)" tags={visualTags} selected={selectedCategories} onToggle={toggleCategory} />
            <TagGroupSection title="المنصات والأجهزة" groupName="المنصات والأجهزة (Platforms)" tags={platformTags} selected={selectedCategories} onToggle={toggleCategory} />
            <TagGroupSection title="المتاجر والوصول" groupName="المتاجر والوصول (Stores & Access)" tags={storeTags} selected={selectedCategories} onToggle={toggleCategory} />
          </div>
        </div>

        {/* قسم الميديا الإضافية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* الصور الإضافية */}
          <div className="space-y-3">
            <label className="block text-gray-400 text-[10px] font-black uppercase mr-1">صور إضافية</label>
            <div className="space-y-2">
              {additionalImages.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImageField(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    placeholder="رابط صورة أخرى"
                  />
                  <button type="button" onClick={() => removeImageField(index)} className="px-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">✕</button>
                </div>
              ))}
              <button type="button" onClick={addImageField} className="w-full py-2 border border-dashed border-white/10 rounded-lg text-gray-500 text-[10px] font-bold hover:bg-white/5 transition-all">+ إضافة صورة</button>
            </div>
          </div>

          {/* فيديوهات إضافية */}
          <div className="space-y-3">
            <label className="block text-gray-400 text-[10px] font-black uppercase mr-1">روابط فيديو YouTube</label>
            <div className="space-y-2">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                placeholder="الفيديو الأساسي"
              />
              {additionalVideos.map((video, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={video}
                    onChange={(e) => updateVideoField(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                    placeholder="فيديو إضافي"
                  />
                  <button type="button" onClick={() => removeVideoField(index)} className="px-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all">✕</button>
                </div>
              ))}
              <button type="button" onClick={addVideoField} className="w-full py-2 border border-dashed border-white/10 rounded-lg text-gray-500 text-[10px] font-bold hover:bg-white/5 transition-all">+ إضافة فيديو</button>
            </div>
          </div>
        </div>

        {/* الوصف */}
        <div>
          <label className="block text-gray-400 text-[10px] font-black uppercase mb-2 mr-1">قصة / وصف اللعبة *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white outline-none focus:border-purple-500/50 transition-all resize-none placeholder:text-gray-600"
            placeholder="اكتب عن عالم اللعبة وما يميزها..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || allTags.length === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.01] active:scale-[0.99] text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 shadow-xl shadow-purple-500/10"
        >
          {isSubmitting ? "جاري المعالجة..." : "اعتماد ونشر اللعبة"}
        </button>
      </form>
    </div>
  );
}

// مكون فرعي لعرض كل مجموعة بلونها الخاص
function TagGroupSection({ title, groupName, tags, selected, onToggle }: any) {
  const theme = getGroupTheme(groupName);
  if (tags.length === 0) return null;

  return (
    <div className={`p-4 rounded-xl border ${theme.border} bg-white/[0.02]`}>
      <h4 className={`text-[9px] font-black mb-3 uppercase tracking-widest flex items-center gap-2 ${theme.text}`}>
        <span className={`w-1 h-1 rounded-full ${theme.bg}`}></span>
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: any) => (
          <button
            key={tag._id}
            type="button"
            onClick={() => onToggle(tag.name)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
              selected.includes(tag.name)
                ? `${theme.bg} border-transparent text-white ${theme.shadow} scale-105`
                : `bg-white/5 border-white/10 text-gray-400 hover:border-white/20`
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
