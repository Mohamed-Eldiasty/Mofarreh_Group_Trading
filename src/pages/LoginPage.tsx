import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { LogIn, Lock, User } from "lucide-react";

interface LoginPageProps {
  language: "ar" | "en";
}

export default function LoginPage({ language }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthActions();
  const navigate = useNavigate();

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
    },
  };

  const content = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("🔐 Attempting login with:", { username, passwordLength: password.length });

    try {
      // محاولة تسجيل الدخول أولاً
      console.log("📝 Trying signIn...");
      const signInResult = await signIn("password", { 
        flow: "signIn",
        username, 
        password 
      });
      
      console.log("✅ SignIn successful:", signInResult);
      toast.success(language === "ar" ? "تم تسجيل الدخول بنجاح! ✅" : "Login successful! ✅");
      
      // انتظر قليلاً قبل التوجيه للتأكد من تحديث الحالة
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    } catch (signInError: any) {
      console.log("❌ SignIn failed:", signInError.message);
      
      // إذا فشل تسجيل الدخول، نحاول إنشاء حساب جديد
      try {
        console.log("📝 Trying signUp...");
        const signUpResult = await signIn("password", { 
          flow: "signUp",
          username, 
          password 
        });
        
        console.log("✅ SignUp successful:", signUpResult);
        toast.success(language === "ar" ? "تم إنشاء الحساب بنجاح! ✅" : "Account created successfully! ✅");
        
        // انتظر قليلاً قبل التوجيه للتأكد من تحديث الحالة
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      } catch (signUpError: any) {
        console.error("❌ Both signIn and signUp failed:", signUpError);
        // فشل كلا المحاولتين
        toast.error(
          language === "ar" 
            ? "خطأ في اسم المستخدم أو كلمة المرور ❌" 
            : "Invalid username or password ❌"
        );
      }
    } finally {
      setIsLoading(false);
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
        <div className="mt-4 text-center text-xs text-gray-500">
          {language === "ar" 
            ? "💡 افتح Console في المتصفح لرؤية تفاصيل تسجيل الدخول" 
            : "💡 Open Browser Console to see login details"}
        </div>
      </div>
    </div>
  );
}
