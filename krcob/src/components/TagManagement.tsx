import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

// إعادة المجموعات لوضعها المدمج السابق
const TAG_GROUPS = [
  "أنواع الألعاب (Genres)",
  "نمط اللعب والاتصال (Play Style)", // تم الدمج مجدداً
  "المنصات والأجهزة (Platforms)",
  "المتاجر والوصول (Stores & Access)",
  "الأبعاد والمنظور (Visuals & Perspective)"
];

export function TagManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagGroup, setNewTagGroup] = useState(TAG_GROUPS[0]); 
  const [newTagDescription, setNewTagDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tags = useQuery(api.tags.list);
  const addTag = useMutation(api.tags.add);
  const updateTag = useMutation(api.tags.update);
  const removeTag = useMutation(api.tags.remove);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagName.trim()) {
      toast.error("يرجى إدخال اسم التصنيف");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addTag({
        name: newTagName.trim(),
        group: newTagGroup, 
        description: newTagDescription.trim() || undefined,
      });
      
      toast.success("تم إضافة التصنيف بنجاح!");
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء إضافة التصنيف");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTag || !newTagName.trim()) {
      toast.error("يرجى إدخال اسم التصنيف");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await updateTag({
        id: editingTag._id,
        name: newTagName.trim(),
        group: newTagGroup, 
        description: newTagDescription.trim() || undefined,
      });
      
      toast.success("تم تحديث التصنيف بنجاح!");
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء تحديث التصنيف");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingTag(null);
    setShowAddForm(false);
    setNewTagName("");
    setNewTagGroup(TAG_GROUPS[0]);
    setNewTagDescription("");
  };

  const handleRemoveTag = async (tagId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا التصنيف؟")) {
      try {
        await removeTag({ id: tagId as any });
        toast.success("تم حذف التصنيف بنجاح");
      } catch (error: any) {
        toast.error(error.message || "حدث خطأ أثناء حذف التصنيف");
      }
    }
  };

  const startEdit = (tag: any) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagGroup(tag.group || TAG_GROUPS[0]);
    setNewTagDescription(tag.description || "");
    setShowAddForm(false);
  };

  if (tags === undefined) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">إدارة التصنيفات</h3>
        <button
          onClick={() => { setShowAddForm(true); setEditingTag(null); }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          إضافة تصنيف جديد
        </button>
      </div>

      {(showAddForm || editingTag) && (
        <div className="bg-white/5 border border-white/20 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">
            {editingTag ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
          </h4>
          <form onSubmit={editingTag ? handleUpdateTag : handleAddTag} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-200 font-medium mb-2">اسم التصنيف *</label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 outline-none"
                  placeholder="رعب، شوتر، Steam..."
                  required
                />
              </div>

              <div>
                <label className="block text-purple-200 font-medium mb-2">اختر المجموعة *</label>
                <select
                  value={newTagGroup}
                  onChange={(e) => setNewTagGroup(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-lg text-white focus:border-purple-400 outline-none"
                >
                  {TAG_GROUPS.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-purple-200 font-medium mb-2">وصف التصنيف (اختياري)</label>
              <textarea
                value={newTagDescription}
                onChange={(e) => setNewTagDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 outline-none resize-none"
                placeholder="اكتب وصفاً للتصنيف..."
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={resetForm} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all">
                إلغاء
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg disabled:opacity-50">
                {isSubmitting ? "جاري الحفظ..." : editingTag ? "تحديث" : "إضافة"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {tags.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">لا توجد تصنيفات حالياً</p>
          </div>
        ) : (
          tags.map((tag) => (
            <div key={tag._id} className="bg-white/5 border border-white/20 rounded-lg p-4 hover:bg-white/10 transition-all">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-lg font-semibold text-white">{tag.name}</h4>
                    <span className="text-[10px] bg-purple-900/50 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                      {tag.group || "بدون مجموعة"}
                    </span>
                  </div>
                  {tag.description && <p className="text-gray-300 text-sm">{tag.description}</p>}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => startEdit(tag)} className="text-blue-400 hover:text-blue-300 transition-colors" title="تعديل">
                    ✏️
                  </button>
                  <button onClick={() => handleRemoveTag(tag._id)} className="text-red-400 hover:text-red-300 transition-colors" title="حذف">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
