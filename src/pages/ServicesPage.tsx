import { Wrench, Recycle, Truck, Package, Home, RotateCw } from "lucide-react";

interface ServicesPageProps {
  language: "ar" | "en";
}

export default function ServicesPage({ language }: ServicesPageProps) {
  const t = {
    ar: {
      title: "خدماتنا",
      subtitle: "نقدم مجموعة شاملة من الخدمات التجارية",
      current: "الخدمات الحالية",
      future: "المشاريع المستقبلية",
      services: [
        {
          title: "شراء السكراب",
          description: "نشتري جميع أنواع السكراب والمعادن بأفضل الأسعار اليومية",
          icon: Recycle,
        },
        {
          title: "تجارة المعدات",
          description: "شراء وبيع المعدات المستعملة بجودة عالية وأسعار تنافسية",
          icon: Wrench,
        },
        {
          title: "النقل والتحميل",
          description: "خدمات نقل وتحميل احترافية للمعدات والسكراب",
          icon: Truck,
        },
        {
          title: "التفكيك والتصفية",
          description: "خدمات تفكيك وتصفية المعدات والمنشآت",
          icon: Package,
        },
        {
          title: "التوريد",
          description: "توريد المعدات والمواد حسب احتياجات العملاء",
          icon: Package,
        },
      ],
      futureProjects: [
        {
          title: "توريد وصيانة البرتبلات",
          description: "قريباً: توريد وصيانة البرتبلات والحاويات بجودة عالية",
          icon: Home,
        },
        {
          title: "إعادة تدوير الإطارات",
          description: "قريباً: مشروع إعادة تدوير الإطارات المستعملة",
          icon: RotateCw,
        },
      ],
    },
    en: {
      title: "Our Services",
      subtitle: "We offer a comprehensive range of trading services",
      current: "Current Services",
      future: "Future Projects",
      services: [
        {
          title: "Scrap Purchasing",
          description: "We buy all types of scrap and metals at the best daily prices",
          icon: Recycle,
        },
        {
          title: "Equipment Trading",
          description: "Buying and selling used equipment with high quality and competitive prices",
          icon: Wrench,
        },
        {
          title: "Transportation & Loading",
          description: "Professional transportation and loading services for equipment and scrap",
          icon: Truck,
        },
        {
          title: "Dismantling & Liquidation",
          description: "Equipment and facility dismantling and liquidation services",
          icon: Package,
        },
        {
          title: "Supply",
          description: "Supply of equipment and materials according to customer needs",
          icon: Package,
        },
      ],
      futureProjects: [
        {
          title: "Portables Supply & Maintenance",
          description: "Coming soon: High-quality supply and maintenance of portables and containers",
          icon: Home,
        },
        {
          title: "Tire Redevelopment",
          description: "Coming soon: Used tire redevelopment project",
          icon: RotateCw,
        },
      ],
    },
  };

  const content = t[language];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            {content.title}
          </h1>
          <p className="text-xl text-gray-600">
            {content.subtitle}
          </p>
        </div>

        {/* Current Services */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-start text-gray-900 animate-fade-in-up">
            {content.current}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#7c1f26] to-[#5a1519] rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-start text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-start">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Future Projects */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-start text-gray-900 animate-fade-in-up">
            {content.future}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.futureProjects.map((project, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#d4af37]/10 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-[#d4af37]/30 animate-fade-in-up"
                style={{ animationDelay: `${(index + content.services.length) * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <project.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-start text-gray-900">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-start">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
