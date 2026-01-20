import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Calendar, MapPin, Filter } from "lucide-react";

interface AuctionsPageProps {
  language: "ar" | "en";
}

export default function AuctionsPage({ language }: AuctionsPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [kindFilter, setKindFilter] = useState<string>("");
  
  const auctions = useQuery(api.auctions.list, {
    status: statusFilter || undefined,
    kind: kindFilter || undefined,
  });

  const t = {
    ar: {
      title: "المزادات",
      subtitle: "مزادات منظمة وشفافة للمعدات والسكراب",
      filters: "الفلاتر",
      status: "الحالة",
      kind: "النوع",
      allStatuses: "جميع الحالات",
      allKinds: "جميع الأنواع",
      ongoing: "جارية",
      upcoming: "قادمة",
      ended: "منتهية",
      inPerson: "حضوري",
      online: "أونلاين",
      sealedBid: "ظرف مغلق",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      noResults: "لا توجد نتائج",
    },
    en: {
      title: "Auctions",
      subtitle: "Organized and transparent auctions for equipment and scrap",
      filters: "Filters",
      status: "Status",
      kind: "Type",
      allStatuses: "All Statuses",
      allKinds: "All Types",
      ongoing: "Ongoing",
      upcoming: "Upcoming",
      ended: "Ended",
      inPerson: "In-Person",
      online: "Online",
      sealedBid: "Sealed Bid",
      startDate: "Start Date",
      endDate: "End Date",
      noResults: "No results found",
    },
  };

  const content = t[language];

  const statusLabels = {
    ongoing: content.ongoing,
    upcoming: content.upcoming,
    ended: content.ended,
  };

  const kindLabels = {
    "in-person": content.inPerson,
    online: content.online,
    "sealed-bid": content.sealedBid,
  };

  const statusColors = {
    ongoing: "bg-green-100 text-green-700",
    upcoming: "bg-blue-100 text-blue-700",
    ended: "bg-gray-100 text-gray-700",
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
            <Filter className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-xl font-bold text-gray-900">{content.filters}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {content.status}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all"
              >
                <option value="">{content.allStatuses}</option>
                <option value="ongoing">{content.ongoing}</option>
                <option value="upcoming">{content.upcoming}</option>
                <option value="ended">{content.ended}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {content.kind}
              </label>
              <select
                value={kindFilter}
                onChange={(e) => setKindFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 outline-none transition-all"
              >
                <option value="">{content.allKinds}</option>
                <option value="in-person">{content.inPerson}</option>
                <option value="online">{content.online}</option>
                <option value="sealed-bid">{content.sealedBid}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Auctions Grid */}
        {auctions === undefined ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#d4af37] border-t-transparent"></div>
          </div>
        ) : auctions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">{content.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {auctions.map((item, index) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.heroUrl && (
                  <img
                    src={item.heroUrl}
                    alt={language === "ar" ? item.titleAr : item.titleEn}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {kindLabels[item.kind]}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-start text-gray-900">
                    {language === "ar" ? item.titleAr : item.titleEn}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {content.startDate}: {new Date(item.startDate).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {content.endDate}: {new Date(item.endDate).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{item.city}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-start line-clamp-3 mb-4">
                    {language === "ar" ? item.descriptionAr : item.descriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
