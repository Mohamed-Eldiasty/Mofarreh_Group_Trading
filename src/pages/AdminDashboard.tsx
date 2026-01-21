import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogOut, Package, Recycle, Gavel, MessageSquare } from "lucide-react";
import EquipmentManager from "../components/EquipmentManager";
import ScrapManager from "../components/ScrapManager";

interface AdminDashboardProps {
  language: "ar" | "en";
}

export default function AdminDashboard({ language }: AdminDashboardProps) {
  const user = useQuery(api.auth.loggedInUser);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  const t = {
    ar: {
      title: "لوحة الإدارة",
      welcome: "مرحباً",
      logout: "تسجيل الخروج",
      equipment: "إدارة المعدات",
      scrap: "إدارة السكراب",
      auctions: "إدارة المزادات",
      messages: "الرسائل",
      loading: "جاري التحميل...",
    },
    en: {
      title: "Admin Dashboard",
      welcome: "Welcome",
      logout: "Logout",
      equipment: "Manage Equipment",
      scrap: "Manage Scrap",
      auctions: "Manage Auctions",
      messages: "Messages",
      loading: "Loading...",
    },
  };

  const content = t[language];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Show loading while checking authentication
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c1f26] mx-auto mb-4"></div>
          <p className="text-gray-600">{content.loading}</p>
        </div>
      </div>
    );
  }

  // User is not logged in (null), redirect handled by useEffect
  if (user === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 text-start">
                {content.title}
              </h1>
              <p className="text-gray-600 text-start">
                {content.welcome}, {user.name || user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-5 h-5" />
              {content.logout}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-s-4 border-[#7c1f26]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#7c1f26]/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[#7c1f26]" />
              </div>
              <div className="text-start">
                <p className="text-gray-600 text-sm">{content.equipment}</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-s-4 border-green-600">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-start">
                <p className="text-gray-600 text-sm">{content.scrap}</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-s-4 border-[#d4af37]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#d4af37]/10 rounded-lg flex items-center justify-center">
                <Gavel className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div className="text-start">
                <p className="text-gray-600 text-sm">{content.auctions}</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-s-4 border-blue-600">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-start">
                <p className="text-gray-600 text-sm">{content.messages}</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="space-y-8">
          {/* Equipment Manager */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-start flex items-center gap-3">
              <Package className="w-7 h-7 text-[#7c1f26]" />
              {content.equipment}
            </h2>
            <EquipmentManager language={language} />
          </div>

          {/* Scrap Manager */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-start flex items-center gap-3">
              <Recycle className="w-7 h-7 text-green-600" />
              {content.scrap}
            </h2>
            <ScrapManager language={language} />
          </div>
        </div>
      </div>
    </div>
  );
}
