import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * دالة دمج كلاسات Tailwind وتجنب التعارض
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * دالة جلب التنسيقات والألوان المخصصة لكل مجموعة تصنيفات
 * الألوان المعتمدة:
 * - أنواع الألعاب: أرجواني (Purple)
 * - نمط اللعب: أزرق (Blue)
 * - الأبعاد: أخضر (Emerald)
 * - المنصات: برتقالي (Orange)
 * - المتاجر: أحمر (Rose)
 */
export const getGroupTheme = (groupName: string) => {
  switch (groupName) {
    case "أنواع الألعاب (Genres)":
      return {
        text: "text-purple-400",
        bg: "bg-purple-600",
        border: "border-purple-500/30",
        ghostBg: "bg-purple-900/20",
        gradient: "from-purple-600 to-indigo-600",
        shadow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
      };
    case "نمط اللعب والاتصال (Play Style)":
      return {
        text: "text-blue-400",
        bg: "bg-blue-600",
        border: "border-blue-500/30",
        ghostBg: "bg-blue-900/20",
        gradient: "from-blue-600 to-cyan-600",
        shadow: "shadow-[0_0_15px_rgba(59,130,246,0.4)]",
      };
    case "الأبعاد والمنظور (Visuals & Perspective)":
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-600",
        border: "border-emerald-500/30",
        ghostBg: "bg-emerald-900/20",
        gradient: "from-emerald-600 to-teal-600",
        shadow: "shadow-[0_0_15px_rgba(16,185,129,0.4)]",
      };
    case "المنصات والأجهزة (Platforms)":
      return {
        text: "text-orange-400",
        bg: "bg-orange-600",
        border: "border-orange-500/30",
        ghostBg: "bg-orange-900/20",
        gradient: "from-orange-600 to-amber-600",
        shadow: "shadow-[0_0_15px_rgba(249,115,22,0.4)]",
      };
    case "المتاجر والوصول (Stores & Access)":
      return {
        text: "text-rose-400",
        bg: "bg-rose-600",
        border: "border-rose-500/30",
        ghostBg: "bg-rose-900/20",
        gradient: "from-rose-600 to-red-600",
        shadow: "shadow-[0_0_15px_rgba(244,63,94,0.4)]",
      };
    default:
      return {
        text: "text-gray-400",
        bg: "bg-gray-600",
        border: "border-white/10",
        ghostBg: "bg-white/5",
        gradient: "from-gray-600 to-slate-600",
        shadow: "",
      };
  }
};
