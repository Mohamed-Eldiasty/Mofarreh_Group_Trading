import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MessageCircle, Filter, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface EquipmentPageProps {
  language: "ar" | "en";
}

export default function EquipmentPage({ language }: EquipmentPageProps) {
  const [cityFilter, setCityFilter] = useState<string>("");
  const [conditionFilter, setConditionFilter] = useState<string>("");
  
  const equipment = useQuery(api.equipment.list, {
    city: cityFilter || undefined,
    condition: conditionFilter || undefined,
    status: "active",
  });

  const t = {
    ar: {
      title: "المعدات المستعملة",
      subtitle: "تصفح مجموعتنا من المعدات عالية الجودة",
      filters: "الفلاتر",
      city: "المدينة",
      condition: "الحالة",
      allCities: "جميع المدن",
      allConditions: "جميع الحالات",
      new: "جديد",
      used: "مستعمل",
      excellent: "ممتاز",
      sar: "ريال",
      whatsapp: "واتساب",
      noResults: "لا توجد نتائج",
    },
    en: {
      title: "Used Equipment",
      subtitle: "Browse our collection of high-quality equipment",
      filters: "Filters",
      city: "City",
      condition: "Condition",
      allCities: "All Cities",
      allConditions: "All Conditions",
      new: "New",
      used: "Used",
      excellent: "Excellent",
      sar: "SAR",
      whatsapp: "WhatsApp",
      noResults: "No results found",
    },
  };

  const content = t[language];

  const conditionLabels = {
    new: content.new,
    used: content.used,
    excellent: content.excellent,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 text-start text-gray-900">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600 text-start">
            {content.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up delay-100">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-[#7c1f26]" />
            <h2 className="text-xl font-bold text-gray-900">{content.filters}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {content.city}
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 outline-none transition-all"
              >
                <option value="">{content.allCities}</option>
                <option value="الدمام">الدمام</option>
                <option value="الخبر">الخبر</option>
                <option value="الظهران">الظهران</option>
                <option value="الجبيل">الجبيل</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {content.condition}
              </label>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 outline-none transition-all"
              >
                <option value="">{content.allConditions}</option>
                <option value="new">{content.new}</option>
                <option value="used">{content.used}</option>
                <option value="excellent">{content.excellent}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        {equipment === undefined ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7c1f26] border-t-transparent"></div>
          </div>
        ) : equipment.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">{content.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipment.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.imageUrls && item.imageUrls.length > 0 && (
                  <img
                    src={item.imageUrls[0]}
                    alt={language === "ar" ? item.titleAr : item.titleEn}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-start text-gray-900">
                    {language === "ar" ? item.titleAr : item.titleEn}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {item.city}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {conditionLabels[item.condition]}
                    </span>
                  </div>

                  {item.price && (
                    <p className="text-2xl font-bold text-[#7c1f26] mb-4 text-start">
                      {item.price.toLocaleString()} {content.sar}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Link
                      to={`/equipment/${item.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#7c1f26] hover:bg-[#5a1519] text-white rounded-lg font-semibold transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      {language === "ar" ? "التفاصيل" : "Details"}
                    </Link>
                    <a
                      href={`https://wa.me/966556192129`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
