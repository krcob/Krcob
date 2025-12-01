import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

type Tag = {
  _id: Id<"tags">;
  name: string;
  description?: string | null;
  createdByName?: string | null;
  _creationTime: number;
};

export function TagManagement() {
  const tags = useQuery(api.tags.list);
  const addTag = useMutation(api.tags.add);
  const updateTag = useMutation(api.tags.update);
  const removeTag = useMutation(api.tags.remove);

  const [newTagName, setNewTagName] = useState("");
  const [newTagDesc, setNewTagDesc] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      toast.error("اسم التصنيف لا يمكن أن يكون فارغاً");
      return;
    }
    try {
      await addTag({ name: newTagName, description: newTagDesc });
      setNewTagName("");
      setNewTagDesc("");
      toast.success("تمت إضافة التصنيف بنجاح");
    } catch (error: any) {
      toast.error(error.message || "فشل في إضافة التصنيف");
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    try {
      await updateTag({
        id: editingTag._id,
        name: editingTag.name,
        description: editingTag.description ?? undefined,
      });
      setEditingTag(null);
      toast.success("تم تحديث التصنيف بنجاح");
    } catch (error: any) {
      toast.error(error.message || "فشل في تحديث التصنيف");
    }
  };

  const handleRemoveTag = async (id: Id<"tags">) => {
    if (confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
      try {
        await removeTag({ id });
        toast.success("تم حذف التصنيف بنجاح");
      } catch (error: any) {
        toast.error(error.message || "فشل في حذف التصنيف");
      }
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">إدارة التصنيفات</h3>
      
      {/* Add Tag Form */}
      <form onSubmit={handleAddTag} className="mb-6 space-y-3">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="اسم التصنيف الجديد"
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
        />
        <textarea
          value={newTagDesc}
          onChange={(e) => setNewTagDesc(e.target.value)}
          placeholder="وصف التصنيف (اختياري)"
          rows={2}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
        />
        <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
          إضافة تصنيف
        </button>
      </form>

      {/* Tags List */}
      <div className="space-y-2">
        {tags?.map((tag) => (
          <div key={tag._id} className="bg-white/5 p-3 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{tag.name}</p>
              <p className="text-sm text-gray-400">{tag.description || "لا يوجد وصف"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingTag(tag as Tag)} className="text-blue-400 hover:text-blue-300">✏️</button>
              <button onClick={() => handleRemoveTag(tag._id)} className="text-red-400 hover:text-red-300">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTag && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10 w-full max-w-md">
            <h3 className="text-2xl font-bold text-white mb-4">تعديل التصنيف</h3>
            <form onSubmit={handleUpdateTag} className="space-y-3">
              <input
                type="text"
                value={editingTag.name}
                onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
              <textarea
                value={editingTag.description || ""}
                onChange={(e) => setEditingTag({ ...editingTag, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingTag(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">إلغاء</button>
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">حفظ التعديلات</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
