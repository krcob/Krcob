import { useState } from "react";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface AdminLoginModalProps {
  onClose: () => void;
}

export function AdminLoginModal({ onClose }: AdminLoginModalProps) {
  const [adminCode, setAdminCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn } = useAuthActions();
  const verifyAdminCode = useMutation(api.games.verifyAdminCode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminCode.trim()) {
      toast.error("يرجى إدخال كود الإدارة");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First, sign in anonymously to get authenticated
      await signIn("anonymous");
      
      // Wait a moment for authentication to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Then verify the admin code
      const result = await verifyAdminCode({ code: adminCode.trim() });
      if (result.success) {
        toast.success(`مرحباً ${result.adminName}! تم تسجيل الدخول كمدير بنجاح`);
        onClose();
      }
    } catch (error: any) {
      toast.error(error.message || "كود الإدارة غير صحيح");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-white/10 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">تسجيل دخول المدير</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-200 font-medium mb-2">
              كود الإدارة
            </label>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all"
              placeholder="أدخل كود الإدارة"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isSubmitting ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>
          </div>
        </form>
        
        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-200 text-sm text-center">
            💡 يمكن للمديرين إضافة وتعديل وحذف الألعاب والتصنيفات
          </p>
        </div>
      </div>
    </div>
  );
}
