import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, MapPin, Calendar, CheckCircle, Phone, Mail } from "lucide-react";
import { useState } from "react";

interface EquipmentDetailPageProps {
  language: "ar" | "en";
}

export default function EquipmentDetailPage({ language }: EquipmentDetailPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const equipment = useQuery(api.equipment.getBySlug, { slug: slug || "" });
  const [selectedImage, setSelectedImage] = useState(0);

  const t = {
    ar: {
      back: "العودة للمعدات",
      gallery: "معرض الصور",
      details: "التفاصيل",
      specifications: "المواصفات",
      description: "الوصف",
      location: "الموقع",
      condition: "الحالة",
      price: "السعر",
      status: "الحالة",
      contact: "تواصل معنا",
      contactText: "للاستفسار عن هذه المعدة",
      conditions: {
        new: "جديد",
        used: "مستعمل",
        excellent: "ممتاز",
      },
      statuses: {
        active: "متاح",
        sold: "مباع",
        pending: "قيد الانتظار",
      },
      notFound: "المعدة غير موجودة",
      loading: "جاري التحميل...",
    },
    en: {
      back: "Back to Equipment",
      gallery: "Image Gallery",
      details: "Details",
      specifications: "Specifications",
      description: "Description",
      location: "Location",
      condition: "Condition",
      price: "Price",
      status: "Status",
      contact: "Contact Us",
      contactText: "For inquiries about this equipment",
      conditions: {
        new: "New",
        used: "Used",
        excellent: "Excellent",
      },
      statuses: {
        active: "Available",
        sold: "Sold",
        pending: "Pending",
      },
      notFound: "Equipment not found",
      loading: "Loading...",
    },
  };

  const content = t[language];
  const isRTL = language === "ar";

  if (equipment === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7c1f26] mx-auto mb-4"></div>
          <p className="text-gray-600">{content.loading}</p>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{content.notFound}</h1>
          <Link
            to="/equipment"
            className="text-[#7c1f26] hover:underline font-semibold"
          >
            {content.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/equipment"
          className="inline-flex items-center gap-2 text-[#7c1f26] hover:underline font-semibold mb-8"
        >
          {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          {content.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* معرض الصور */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {equipment.imageUrls.length > 0 ? (
                <img
                  src={equipment.imageUrls[selectedImage]}
                  alt={isRTL ? equipment.titleAr : equipment.titleEn}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">{content.gallery}</span>
                </div>
              )}
            </div>

            {/* صور مصغرة */}
            {equipment.imageUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {equipment.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#7c1f26] shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* التفاصيل */}
          <div className="space-y-6">
            {/* العنوان */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 text-start">
                {isRTL ? equipment.titleAr : equipment.titleEn}
              </h1>
              <div className="flex flex-wrap gap-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    equipment.status === "active"
                      ? "bg-green-100 text-green-800"
                      : equipment.status === "sold"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {content.statuses[equipment.status]}
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {content.conditions[equipment.condition]}
                </span>
              </div>
            </div>

            {/* السعر */}
            {equipment.price && (
              <div className="bg-gradient-to-r from-[#7c1f26] to-[#5a1519] rounded-2xl p-6 text-white">
                <p className="text-sm opacity-90 mb-2">{content.price}</p>
                <p className="text-4xl font-bold">
                  {equipment.price.toLocaleString()} {equipment.currency}
                </p>
              </div>
            )}

            {/* الموقع */}
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-[#7c1f26]" />
              <span className="font-semibold">{equipment.city}</span>
            </div>

            {/* المواصفات */}
            {equipment.specs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-start">
                  {content.specifications}
                </h2>
                <div className="space-y-3">
                  {equipment.specs.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0"
                    >
                      <span className="text-gray-600 font-medium">
                        {isRTL ? spec.labelAr : spec.labelEn}
                      </span>
                      <span className="text-gray-900 font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الوصف */}
            {(equipment.descriptionAr || equipment.descriptionEn) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-start">
                  {content.description}
                </h2>
                <p className="text-gray-700 leading-relaxed text-start">
                  {isRTL ? equipment.descriptionAr : equipment.descriptionEn}
                </p>
              </div>
            )}

            {/* زر التواصل */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-start">
                {content.contact}
              </h3>
              <p className="text-gray-600 mb-6 text-start">{content.contactText}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+966123456789"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c1f26] to-[#5a1519] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  {isRTL ? "اتصل الآن" : "Call Now"}
                </a>
                <Link
                  to="/contact"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  {isRTL ? "أرسل رسالة" : "Send Message"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
