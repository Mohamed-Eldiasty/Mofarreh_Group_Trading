import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Phone, MessageCircle, ArrowRight, Wrench, Recycle, Gavel } from "lucide-react";
import { useEffect, useState } from "react";

interface HomePageProps {
  language: "ar" | "en";
}

export default function HomePage({ language }: HomePageProps) {
  const featuredEquipment = useQuery(api.equipment.featured);
  const seedAll = useMutation(api.seedData.seedAll);
  const [hasSeeded, setHasSeeded] = useState(false);

  // Auto-seed data on first visit if no equipment exists
  useEffect(() => {
    if (featuredEquipment !== undefined && featuredEquipment.length === 0 && !hasSeeded) {
      seedAll({}).then(() => setHasSeeded(true)).catch(() => {});
    }
  }, [featuredEquipment, hasSeeded, seedAll]);

  const t = {
    ar: {
      hero: {
        title: "مجموعة مفرح",
        subtitle: "قسم التجارة",
        description: "شريكك الموثوق في شراء وبيع المعدات والسكراب، تنظيم المزادات، والنقل والتوريد في المنطقة الشرقية",
        cta1: "اتصل بنا",
        cta2: "واتساب",
      },
      sections: {
        equipment: "المعدات المستعملة",
        equipmentDesc: "معدات عالية الجودة بأسعار تنافسية",
        scrap: "السكراب والمعادن",
        scrapDesc: "شراء وبيع السكراب بأفضل الأسعار",
        auctions: "المزادات",
        auctionsDesc: "مزادات منظمة وشفافة",
      },
      featured: {
        title: "المعدات المميزة",
        viewAll: "عرض الكل",
        sar: "ريال",
        whatsapp: "واتساب",
      },
    },
    en: {
      hero: {
        title: "Mofarreh Group",
        subtitle: "Trading Division",
        description: "Your trusted partner in buying and selling equipment and scrap, organizing auctions, and transportation in the Eastern Province",
        cta1: "Call Us",
        cta2: "WhatsApp",
      },
      sections: {
        equipment: "Used Equipment",
        equipmentDesc: "High-quality equipment at competitive prices",
        scrap: "Scrap & Metals",
        scrapDesc: "Buy and sell scrap at the best prices",
        auctions: "Auctions",
        auctionsDesc: "Organized and transparent auctions",
      },
      featured: {
        title: "Featured Equipment",
        viewAll: "View All",
        sar: "SAR",
        whatsapp: "WhatsApp",
      },
    },
  };

  const content = t[language];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://videos.pexels.com/video-files/8061661/8061661-hd_1280_720_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-start">
            {content.hero.title}
          </h1>
          <p className="text-3xl md:text-4xl font-semibold mb-6 text-[#d4af37] text-start">
            {content.hero.subtitle}
          </p>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 text-start max-w-3xl">
            {content.hero.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-start animate-fade-in-up delay-200">
            <a
              href="tel:+966556192129"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-[#7c1f26] hover:bg-[#5a1519] text-white rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Phone className="w-6 h-6" />
              {content.hero.cta1}
            </a>
            <a
              href="https://wa.me/966556192129"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              {content.hero.cta2}
            </a>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Equipment */}
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 animate-fade-in-up">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7c1f26] to-[#5a1519] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-start text-gray-900">
                {content.sections.equipment}
              </h3>
              <p className="text-gray-600 text-start mb-4">
                {content.sections.equipmentDesc}
              </p>
              <a href="/equipment" className="flex items-center gap-2 text-[#7c1f26] font-semibold hover:gap-3 transition-all">
                {content.featured.viewAll}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Scrap */}
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 animate-fade-in-up delay-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Recycle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-start text-gray-900">
                {content.sections.scrap}
              </h3>
              <p className="text-gray-600 text-start mb-4">
                {content.sections.scrapDesc}
              </p>
              <a href="/scrap" className="flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all">
                {content.featured.viewAll}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Auctions */}
            <div className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 animate-fade-in-up delay-200">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Gavel className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-start text-gray-900">
                {content.sections.auctions}
              </h3>
              <p className="text-gray-600 text-start mb-4">
                {content.sections.auctionsDesc}
              </p>
              <a href="/auctions" className="flex items-center gap-2 text-[#d4af37] font-semibold hover:gap-3 transition-all">
                {content.featured.viewAll}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      {featuredEquipment && featuredEquipment.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-12 text-start text-gray-900">
              {content.featured.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEquipment.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
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
                    <p className="text-gray-600 mb-4 text-start">{item.city}</p>
                    {item.price && (
                      <p className="text-2xl font-bold text-[#7c1f26] mb-4 text-start">
                        {item.price.toLocaleString()} {content.featured.sar}
                      </p>
                    )}
                    <a
                      href={`https://wa.me/966556192129?text=${encodeURIComponent(
                        `مرحباً، أنا مهتم بـ ${language === "ar" ? item.titleAr : item.titleEn}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {content.featured.whatsapp}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
