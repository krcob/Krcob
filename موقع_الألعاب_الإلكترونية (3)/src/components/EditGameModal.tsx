import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface EditGameModalProps {
  game: {
    _id: Id<"games">;
    title: string;
    description: string;
    imageUrl: string;
    additionalImages?: string[] | null;
    videoUrl?: string | null;
    additionalVideos?: string[] | null;
    categories: string[];
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function EditGameModal({ game, onClose, onSuccess }: EditGameModalProps) {
  const [title, setTitle] = useState(game.title);
  const [description, setDescription] = useState(game.description);
  const [imageUrl, setImageUrl] = useState(game.imageUrl);
  const [additionalImages, setAdditionalImages] = useState(game.additionalImages?.join("\n") || "");
  const [videoUrl, setVideoUrl] = useState(game.videoUrl || "");
  const [additionalVideos, setAdditionalVideos] = useState(game.additionalVideos?.join("\n") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(game.categories);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateGame = useMutation(api.games.update);
  const allCategories = useQuery(api.games.getCategories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl || selectedCategories.length === 0) {
      toast.error("يرجى ملء جميع الحقول المطلوبة (العنوان, الوصف, الصورة الرئيسية, التصنيفات)");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateGame({
        id: game._id,
        title,
        description,
        imageUrl,
        additionalImages: additionalImages.split("\n").filter(Boolean),
        videoUrl,
        additionalVideos: additionalVideos.split("\n").filter(Boolean),
        categories: selectedCategories,
      });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "فشل في تحديث اللعبة");
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-white mb-4">تعديل اللعبة</h3>
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

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">إلغاء</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed">
              {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
