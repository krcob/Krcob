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
  // استدعاء جميع التصنيفات المسجلة في النظام
  const allTags = useQuery(api.tags.list);

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
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

  // تصفية التصنيفات بناءً على المجموعة المدمجة (إعادة الوضع السابق)
  const genreTags = allTags.filter(t => t.group === "أنواع الألعاب (Genres)");
  const playStyleTags = allTags.filter(t => t.group === "نمط اللعب والاتصال (Play Style)");
  const platformTags = allTags.filter(t => t.group === "المنصات والأجهزة (Platforms)");
  const storeTags = allTags.filter(t => t.group === "المتاجر والوصول (Stores & Access)");
  const visualTags = allTags.filter(t => t.group === "الأبعاد والمنظور (Visuals & Perspective)");

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">إضافة لعبة جديدة</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-purple-200 font-medium mb-2 text-right">اسم اللعبة *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-right outline-none focus:border-purple-400"
            placeholder="أدخل اسم اللعبة"
            required
          />
        </div>

        {/* قسم التصنيفات المنظم */}
        <div className="space-y-4">
          <label className="block text-purple-200 font-medium text-right">التصنيفات *</label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الأنواع */}
            <TagGroup title="أنواع الألعاب" tags={genreTags} selected={selectedCategories} onToggle={toggleCategory} />
            
            {/* نمط اللعب والاتصال (المجموعة المدمجة) */}
            <TagGroup title="نمط اللعب والاتصال" tags={playStyleTags} selected={selectedCategories} onToggle={toggleCategory} />
            
            {/* المنصات */}
            <TagGroup title="المنصات والأجهزة" tags={platformTags} selected={selectedCategories} onToggle={toggleCategory} />
            
            {/* المتاجر */}
            <TagGroup title="المتاجر والوصول" tags={storeTags} selected={selectedCategories} onToggle={toggleCategory} />
            
            {/* الأبعاد */}
            <TagGroup title="الأبعاد والمنظور" tags={visualTags} selected={selectedCategories} onToggle={toggleCategory} />
          </div>
        </div>

        {/* بقية الحقول (الصور والفيديوهات والوصف) كما هي */}
        <div>
          <label className="block text-purple-200 font-medium mb-2 text-right">رابط الصورة الرئيسية *</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white outline-none focus:border-purple-400"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div>
          <label className="block text-purple-200 font-medium mb-2 text-right">وصف اللعبة *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-right outline-none focus:border-purple-400 resize-none"
            placeholder="اكتب وصفاً مختصراً عن اللعبة..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? "جاري الإضافة..." : "إضافة اللعبة"}
        </button>
      </form>
    </div>
  );
}

// مكون فرعي لعرض مجموعات التاقات بشكل أنيق
function TagGroup({ title, tags, selected, onToggle }: { title: string, tags: any[], selected: string[], onToggle: (name: string) => void }) {
  if (tags.length === 0) return null;
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <span className="block text-xs font-bold text-purple-400 uppercase mb-3 text-right">{title}</span>
      <div className="flex flex-wrap gap-2 justify-start flex-row-reverse">
        {tags.map((tag) => (
          <button
            key={tag._id}
            type="button"
            onClick={() => onToggle(tag.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selected.includes(tag.name)
                ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
