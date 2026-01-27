import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { LogIn, Lock, User, AlertCircle, Trash2 } from "lucide-react";

interface LoginPageProps {
  language: "ar" | "en";
}

export default function LoginPage({ language }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  
  // Debug: جلب معلومات المستخدمين
  const allUsers = useQuery(api.users.listAll);
  const deleteAllUsers = useMutation(api.users.deleteAll);

  const t = {
    ar: {
      title: "تسجيل الدخول",
      subtitle: "لوحة إدارة مجموعة مفرح",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      loginButton: "دخول",
      loggingIn: "جاري تسجيل الدخول...",
      backToHome: "العودة للرئيسية",
      demoTitle: "🔑 بيانات الدخول التجريبية",
      note: "ملاحظة: إذا كانت هذه أول مرة، سيتم إنشاء حساب جديد تلقائياً",
      debugTitle: "🔧 معلومات التطوير",
      totalUsers: "عدد المستخدمين",
      clearUsers: "حذف جميع المستخدمين",
      tryAgain: "جرب مرة أخرى بعد الحذف",
    },
    en: {
      title: "Login",
      subtitle: "Mofarreh Group Admin Panel",
      username: "Username",
      password: "Password",
      loginButton: "Login",
      loggingIn: "Logging in...",
      backToHome: "Back to Home",
      demoTitle: "🔑 Demo Credentials",
      note: "Note: If this is your first time, an account will be created automatically",
      debugTitle: "🔧 Debug Info",
      totalUsers: "Total Users",
      clearUsers: "Clear All Users",
      tryAgain: "Try again after clearing",
    },
  };

  const content = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("🔐 محاولة تسجيل الدخول...", { username, password });
    
    // إنشاء FormData للتوافق مع Convex Auth
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      // محاولة تسجيل الدخول أولاً
      console.log("1️⃣ محاولة signIn...");
      formData.append("flow", "signIn");
      await signIn("password", formData);
      console.log("✅ نجح تسجيل الدخول!");
      toast.success(language === "ar" ? "تم تسجيل الدخول بنجاح! ✅" : "Login successful! ✅");
      setTimeout(() => navigate("/admin"), 500);
    } catch (signInError: any) {
      console.log("❌ فشل تسجيل الدخول:", signInError.message);
      
      // إذا فشل تسجيل الدخول، نحاول إنشاء حساب جديد
      try {
        console.log("2️⃣ محاولة signUp...");
        const signUpFormData = new FormData();
        signUpFormData.append("flow", "signUp");
        signUpFormData.append("username", username);
        signUpFormData.append("password", password);
        await signIn("password", signUpFormData);
        console.log("✅ نجح إنشاء الحساب!");
        toast.success(language === "ar" ? "تم إنشاء الحساب بنجاح! ✅" : "Account created! ✅");
        setTimeout(() => navigate("/admin"), 500);
      } catch (signUpError: any) {
        console.log("❌ فشل إنشاء الحساب:", signUpError.message);
        // فشلت كلتا المحاولتين
        toast.error(
          language === "ar" 
            ? `خطأ: ${signUpError.message}` 
            : `Error: ${signUpError.message}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearUsers = async () => {
    if (confirm(language === "ar" ? "هل تريد حذف جميع المستخدمين؟" : "Delete all users?")) {
      try {
        const result = await deleteAllUsers();
        toast.success(
          language === "ar" 
            ? `تم حذف ${result.deleted} مستخدم` 
            : `Deleted ${result.deleted} users`
        );
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7c1f26] to-[#5a1519] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {content.title}
            </h1>
            <p className="text-gray-600">
              {content.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-semibold text-gray-700 mb-2 text-start"
              >
                {content.username}
              </label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full ps-11 pe-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all outline-none"
                  placeholder={content.username}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-gray-700 mb-2 text-start"
              >
                {content.password}
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full ps-11 pe-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all outline-none"
                  placeholder={content.password}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#7c1f26] to-[#5a1519] text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? content.loggingIn : content.loginButton}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-[#7c1f26] transition-colors"
            >
              ← {content.backToHome}
            </a>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center text-sm bg-gradient-to-r from-[#7c1f26]/10 to-[#5a1519]/10 backdrop-blur-sm rounded-lg p-4 border border-[#7c1f26]/20">
          <p className="font-bold text-[#7c1f26] mb-2">
            {content.demoTitle}
          </p>
          <div className="space-y-1 text-gray-700 mb-3">
            <p>
              <span className="font-semibold">{content.username}:</span> admin
            </p>
            <p>
              <span className="font-semibold">{content.password}:</span> admin123
            </p>
          </div>
          <p className="text-xs text-gray-600 italic">
            {content.note}
          </p>
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-bold text-yellow-900 text-start">
              {content.debugTitle}
            </h3>
          </div>
          
          <div className="space-y-2 text-sm text-gray-700">
            <p className="text-start">
              <span className="font-semibold">{content.totalUsers}:</span>{" "}
              {allUsers?.length || 0}
            </p>
            
            {allUsers && allUsers.length > 0 && (
              <div className="bg-white rounded p-2 text-xs text-start">
                <p className="font-semibold mb-1">المستخدمين الموجودين:</p>
                {allUsers.map((u, i) => (
                  <p key={i}>• {u.name || u.email}</p>
                ))}
              </div>
            )}

            <button
              onClick={handleClearUsers}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all text-sm"
            >
              <Trash2 className="w-4 h-4" />
              {content.clearUsers}
            </button>
            
            <p className="text-xs text-gray-600 italic text-start">
              {content.tryAgain}
            </p>
          </div>
        </div>

        {/* Console Info */}
        <div className="mt-4 text-center text-xs text-gray-500">
          {language === "ar" 
            ? "💡 افتح Console في المتصفح لرؤية تفاصيل تسجيل الدخول" 
            : "💡 Open Browser Console to see login details"}
        </div>
      </div>
    </div>
  );
}
