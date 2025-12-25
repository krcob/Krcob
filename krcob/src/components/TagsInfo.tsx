import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getGroupTheme } from "../../lib/utils";

export default function TagsInfoPage() {
  const allTags = useQuery(api.tags.list);

  if (allTags === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // تقسيم التاقات برمجياً حسب المجموعات الخمس
  const groups = [
    { id: 1, name: "أنواع الألعاب (Genres)", title: "أنواع الألعاب" },
    { id: 2, name: "نمط اللعب والاتصال (Play Style)", title: "نمط اللعب والاتصال" },
    { id: 3, name: "الأبعاد والمنظور (Visuals & Perspective)", title: "الأبعاد والمنظور" },
    { id: 4, name: "المنصات والأجهزة (Platforms)", title: "المنصات والأجهزة" },
    { id: 5, name: "المتاجر والوصول (Stores & Access)", title: "المتاجر والوصول" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12" dir="rtl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-white mb-4">معنى التصنيفات</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          دليلك الشامل لفهم اختصارات ومصطلحات عالم الألعاب المستخدمة في الموقع.
        </p>
      </div>

      <div className="space-y-16">
        {groups.map((group) => {
          const theme = getGroupTheme(group.name);
          const groupTags = allTags.filter((t) => t.group === group.name);

          if (groupTags.length === 0) return null;

          return (
            <section key={group.id} className="space-y-6">
              {/* عنوان المجموعة مع خط ملون */}
              <div className="flex items-center gap-4 mb-8">
                <h2 className={`text-2xl font-black whitespace-nowrap ${theme.text}`}>
                  {group.title}
                </h2>
                <div className={`h-[2px] w-full bg-gradient-to-l ${theme.gradient} opacity-30`}></div>
              </div>

              {/* قائمة البطاقات داخل المجموعة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupTags.map((tag) => (
                  <div
                    key={tag._id}
                    className={`group flex items-center justify-between p-4 bg-white/[0.03] border ${theme.border} rounded-2xl transition-all hover:bg-white/[0.06] hover:scale-[1.02]`}
                  >
                    {/* الشرح بالعربي */}
                    <div className="flex-1 ml-4 text-right">
                      <p className="text-gray-300 text-sm leading-relaxed font-medium">
                        {tag.description}
                      </p>
                    </div>

                    {/* اسم التاق (الاختصار) بخلفية متدرجة */}
                    <div className={`min-w-[100px] text-center px-4 py-2 rounded-xl text-white text-xs font-black shadow-lg bg-gradient-to-br ${theme.gradient} ${theme.shadow}`}>
                      {tag.name}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
