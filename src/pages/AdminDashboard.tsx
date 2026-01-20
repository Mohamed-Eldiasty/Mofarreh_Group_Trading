import { useState } from "react";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInForm } from "../SignInForm";
import { SignOutButton } from "../SignOutButton";
import { Settings, Package, Recycle, Gavel, MessageSquare, Database } from "lucide-react";
import EquipmentManager from "../components/EquipmentManager";
import ScrapManager from "../components/ScrapManager";

interface AdminDashboardProps {
  language: "ar" | "en";
}

export default function AdminDashboard({ language }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"equipment" | "scrap" | "auctions" | "messages">("equipment");
  const seedAll = useMutation(api.seedData.seedAll);
  const [seeding, setSeeding] = useState(false);

  const t = {
    ar: {
      title: "لوحة الإدارة",
      subtitle: "إدارة محتوى الموقع",
      tabs: {
        equipment: "المعدات",
        scrap: "السكراب",
        auctions: "المزادات",
        messages: "الرسائل",
      },
      login: {
        title: "تسجيل الدخول",
        subtitle: "يجب تسجيل الدخول للوصول إلى لوحة الإدارة",
      },
      comingSoon: "قريباً",
    },
    en: {
      title: "Admin Dashboard",
      subtitle: "Manage website content",
      tabs: {
        equipment: "Equipment",
        scrap: "Scrap",
        auctions: "Auctions",
        messages: "Messages",
      },
      login: {
        title: "Login Required",
        subtitle: "You must log in to access the admin dashboard",
      },
      comingSoon: "Coming Soon",
    },
  };

  const content = t[language];

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await seedAll({});
      alert(language === "ar" ? "تم إضافة البيانات التجريبية!" : "Sample data added!");
    } catch (error) {
      alert(language === "ar" ? "حدث خطأ" : "Error occurred");
    } finally {
      setSeeding(false);
    }
  };

  const tabs = [
    { id: "equipment" as const, label: content.tabs.equipment, icon: Package },
    { id: "scrap" as const, label: content.tabs.scrap, icon: Recycle },
    { id: "auctions" as const, label: content.tabs.auctions, icon: Gavel },
    { id: "messages" as const, label: content.tabs.messages, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Authenticated>
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 text-start">
                  {content.title}
                </h1>
                <p className="text-lg text-gray-600 text-start mt-2">
                  {content.subtitle}
                </p>
              </div>
              <SignOutButton />
            </div>
            
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              <Database className="w-5 h-5" />
              {seeding ? (language === "ar" ? "جاري..." : "Loading...") : (language === "ar" ? "إضافة بيانات تجريبية" : "Add Sample Data")}
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up delay-100">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-[#7c1f26] text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="animate-fade-in-up delay-200">
            {activeTab === "equipment" && <EquipmentManager language={language} />}
            {activeTab === "scrap" && <ScrapManager language={language} />}
            
            {activeTab !== "equipment" && activeTab !== "scrap" && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Settings className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {content.comingSoon}
                </h2>
                <p className="text-gray-600">
                  {language === "ar" 
                    ? "سيتم إضافة أدوات إدارة هذا القسم قريباً"
                    : "Management tools for this section will be added soon"}
                </p>
              </div>
            )}
          </div>
        </Authenticated>

        <Unauthenticated>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#7c1f26] to-[#5a1519] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Settings className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {content.login.title}
                </h1>
                <p className="text-gray-600">
                  {content.login.subtitle}
                </p>
              </div>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
      </div>
    </div>
  );
}
