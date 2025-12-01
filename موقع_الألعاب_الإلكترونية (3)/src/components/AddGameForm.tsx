import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function AddGameForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [additionalImages, setAdditionalImages] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [additionalVideos, setAdditionalVideos] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addGame = useMutation(api.games.add);
  const allCategories = useQuery(api.games.getCategories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl || selectedCategories.length === 0) {
      toast.error("يرجى ملء جميع الحقول المطلوبة (العنوان, الوصف, الصورة الرئيسية, التصنيفات)");
      return;
    }
    setIsSubmitting(true);
    try {
      await addGame({
        title,
        description,
        imageUrl,
        additionalImages: additionalImages.split("\n").filter(Boolean),
        videoUrl,
        additionalVideos: additionalVideos.split("\n").filter(Boolean),
        categories: selectedCategories,
      });
      toast.success("تمت إضافة اللعبة بنجاح");
      // Reset form
      setTitle("");
      setDescription("");
      setImageUrl("");
      setAdditionalImages("");
      setVideoUrl("");
      setAdditionalVideos("");
      setSelectedCategories([]);
    } catch (error: any) {
      toast.error(error.message || "فشل في إضافة اللعبة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">إضافة لعبة جديدة</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="عنوان اللعبة" required className="w-full input-style" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف اللعبة" required rows={4} className="w-full input-style" />
        <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="رابط الصورة الرئيسية" required className="w-full input-style" />
        <textarea value={additionalImages} onChange={e => setAdditionalImages(e.target.value)} placeholder="روابط صور إضافية (كل رابط في سطر)" rows={3} className="w-full input-style" />
        <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="رابط الفيديو الرئيسي (YouTube)" className="w-full input-style" />
        <textarea value={additionalVideos} onChange={e => setAdditionalVideos(e.target.value)} placeholder="روابط فيديوهات إضافية (كل رابط في سطر)" rows={3} className="w-full input-style" />
        
        {/* Categories */}
        <div>
          <label className="block text-purple-200 font-medium mb-2">التصنيفات</label>
          <div className="flex flex-wrap gap-2 p-2 bg-white/5 rounded-lg border border-white/20">
            {allCategories?.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${selectedCategories.includes(cat) ? 'bg-purple-600 text-white' : 'bg-white/10 text-purple-200 hover:bg-white/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed">
          {isSubmitting ? "جاري الإضافة..." : "إضافة اللعبة"}
        </button>
      </form>
    </div>
  );
}
