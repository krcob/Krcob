# دليل النشر - Deployment Guide

## النشر على Vercel

### 1. إعداد GitHub Repository

```bash
# إنشاء مستودع جديد
git init
git add .
git commit -m "Initial commit: Games Library"
git branch -M main

# ربط المستودع بـ GitHub (استبدل username و repository-name)
git remote add origin https://github.com/username/games-library.git
git push -u origin main
```

### 2. إعداد Convex

1. اذهب إلى [Convex Dashboard](https://dashboard.convex.dev)
2. أنشئ مشروع جديد
3. احصل على رابط النشر (Deployment URL)
4. نشر المشروع:
   ```bash
   npx convex deploy --prod
   ```

### 3. النشر على Vercel

1. اذهب إلى [Vercel](https://vercel.com)
2. اضغط "New Project"
3. اختر المستودع من GitHub
4. Vercel سيكتشف إعدادات Vite تلقائياً
5. أضف متغير البيئة:
   - `VITE_CONVEX_URL` = رابط Convex الخاص بك

### 4. التحقق من النشر

- تأكد من أن الموقع يعمل بشكل صحيح
- اختبر تسجيل الدخول كمدير
- تأكد من عمل جميع الميزات

## متغيرات البيئة المطلوبة

```env
VITE_CONVEX_URL=https://your-deployment-name.convex.cloud
```

## الميزات المتاحة

- ✅ عرض الألعاب مع الصور والفيديوهات
- ✅ البحث في الألعاب
- ✅ تصنيف الألعاب حسب الفئات
- ✅ لوحة تحكم للإدارة
- ✅ نظام مصادقة آمن للمديرين
- ✅ دعم كامل للغة العربية
- ✅ تصميم متجاوب

## أكواد المديرين

- **AD5d(9&F4EzU** → Krcob
- **9z657E8jjMF** → y._u  
- **M16K3u6uAt** → Admin 1
- **PBewnS7R55** → Admin 2
- **2Gd6uj7X** → Admin 3

## الدعم

- Discord: https://discord.gg/AQyKaJ6MsZ
- YouTube: https://www.youtube.com/@krcob
- الدعم: https://streamlabs.com/krcob/tip
