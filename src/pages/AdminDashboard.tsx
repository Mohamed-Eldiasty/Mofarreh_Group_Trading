import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogOut, Package, Recycle, Gavel, MessageSquare, TrendingUp } from "lucide-react";
import EquipmentManager from "../components/EquipmentManager";
import ScrapManager from "../components/ScrapManager";

interface AdminDashboardProps {
  language: "ar" | "en";
}

export default function AdminDashboard({ language }: AdminDashboardProps) {
  const user = useQuery(api.auth.loggedInUser);
  const equipmentStats = useQuery(api.equipment.stats);
  const scrapStats = useQuery(api.scrap.stats);
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
      equipment: "المعدات",
      scrap: "السكراب",
      auctions: "المزادات",
      messages: "الرسائل",
      loading: "جاري التحميل...",
      active: "نشط",
      sold: "مباع",
      pending: "قيد المراجعة",
      total: "الإجمالي",
      manageEquipment: "إدارة المعدات",
      manageScrap: "إدارة السكراب",
      overview: "نظرة عامة",
    },
    en: {
      title: "Admin Dashboard",
      welcome: "Welcome",
      logout: "Logout",
      equipment: "Equipment",
      scrap: "Scrap",
      auctions: "Auctions",
      messages: "Messages",
      loading: "Loading...",
      active: "Active",
      sold: "Sold",
      pending: "Pending",
      total: "Total",
      manageEquipment: "Manage Equipment",
      manageScrap: "Manage Scrap",
      overview: "Overview",
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#7c1f26] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">{content.loading}</p>
        </div>
      </div>
    );
  }

  // User is not logged in (null), redirect handled by useEffect
  if (user === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7c1f26] to-[#5a1519] rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-start">
                {content.title}
              </h1>
              <p className="text-white/90 text-lg text-start">
                {content.welcome}, {user.name || user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
              {content.logout}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-start flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#7c1f26]" />
            {content.overview}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Equipment Stats */}
            <div className="bg-gradient-to-br from-[#7c1f26] to-[#5a1519] rounded-xl p-6 shadow-xl text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Package className="w-7 h-7" />
                </div>
                <div className="text-end">
                  <p className="text-white/80 text-sm font-medium">{content.equipment}</p>
                  <p className="text-4xl font-bold">{equipmentStats?.total || 0}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs flex-wrap">
                <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {content.active}: {equipmentStats?.active || 0}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {content.sold}: {equipmentStats?.sold || 0}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {content.pending}: {equipmentStats?.pending || 0}
                </span>
              </div>
            </div>

            {/* Scrap Stats */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-xl text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Recycle className="w-7 h-7" />
                </div>
                <div className="text-end">
                  <p className="text-white/80 text-sm font-medium">{content.scrap}</p>
                  <p className="text-4xl font-bold">{scrapStats?.total || 0}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs flex-wrap">
                <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {content.active}: {scrapStats?.active || 0}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {content.sold}: {scrapStats?.sold || 0}
                </span>
              </div>
            </div>

            {/* Auctions Stats */}
            <div className="bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-xl p-6 shadow-xl text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Gavel className="w-7 h-7" />
                </div>
                <div className="text-end">
                  <p className="text-white/80 text-sm font-medium">{content.auctions}</p>
                  <p className="text-4xl font-bold">0</p>
                </div>
              </div>
            </div>

            {/* Messages Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-xl text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div className="text-end">
                  <p className="text-white/80 text-sm font-medium">{content.messages}</p>
                  <p className="text-4xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="space-y-8">
          {/* Equipment Manager */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-start flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7c1f26] to-[#5a1519] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              {content.manageEquipment}
            </h2>
            <EquipmentManager language={language} />
          </div>

          {/* Scrap Manager */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-start flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              {content.manageScrap}
            </h2>
            <ScrapManager language={language} />
          </div>
        </div>
      </div>
    </div>
  );
}
