import { Target, Eye, Award } from "lucide-react";

interface AboutPageProps {
  language: "ar" | "en";
}

export default function AboutPage({ language }: AboutPageProps) {
  const t = {
    ar: {
      title: "من نحن",
      subtitle: "تعرف على مجموعة مفرح – قسم التجارة",
      about: {
        title: "نبذة عنا",
        content: "مجموعة مفرح – قسم التجارة هي شركة رائدة في مجال شراء وبيع المعدات المستعملة والسكراب في المنطقة الشرقية بالمملكة العربية السعودية. نتميز بخبرتنا الواسعة وخدماتنا المتكاملة التي تشمل تنظيم المزادات، النقل والتحميل، والتوريد.",
      },
      vision: {
        title: "رؤيتنا",
        content: "أن نكون الخيار الأول والأكثر موثوقية في مجال تجارة المعدات والسكراب في المنطقة الشرقية، من خلال تقديم خدمات احترافية وأسعار تنافسية.",
      },
      mission: {
        title: "رسالتنا",
        content: "نسعى لتقديم أفضل الخدمات التجارية لعملائنا من خلال الشفافية، الاحترافية، والالتزام بأعلى معايير الجودة في جميع تعاملاتنا.",
      },
      values: {
        title: "قيمنا",
        items: [
          "الشفافية والمصداقية في جميع التعاملات",
          "الاحترافية في تقديم الخدمات",
          "الالتزام بالمواعيد والجودة",
          "بناء علاقات طويلة الأمد مع العملاء",
        ],
      },
    },
    en: {
      title: "About Us",
      subtitle: "Get to know Mofarreh Group - Trading Division",
      about: {
        title: "About Us",
        content: "Mofarreh Group - Trading Division is a leading company in buying and selling used equipment and scrap in the Eastern Province of Saudi Arabia. We are distinguished by our extensive experience and integrated services including organizing auctions, transportation and loading, and supply.",
      },
      vision: {
        title: "Our Vision",
        content: "To be the first and most reliable choice in the field of equipment and scrap trading in the Eastern Province, by providing professional services and competitive prices.",
      },
      mission: {
        title: "Our Mission",
        content: "We strive to provide the best trading services to our customers through transparency, professionalism, and commitment to the highest quality standards in all our dealings.",
      },
      values: {
        title: "Our Values",
        items: [
          "Transparency and credibility in all dealings",
          "Professionalism in service delivery",
          "Commitment to deadlines and quality",
          "Building long-term relationships with customers",
        ],
      },
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

        {/* About Section with Image */}
        <div className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up delay-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <img
              src="https://polished-pony-114.convex.cloud/api/storage/6cdd2065-8045-4322-ae93-0ac4d55cf366"
              alt="Team collaboration"
              className="w-full h-full object-cover"
            />
            <div className="p-12">
              <h2 className="text-3xl font-bold mb-6 text-start text-gray-900">
                {content.about.title}
              </h2>
              <p className="text-lg text-gray-600 text-start leading-relaxed">
                {content.about.content}
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up delay-200">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7c1f26] to-[#5a1519] rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-start text-gray-900">
              {content.vision.title}
            </h2>
            <p className="text-gray-600 text-start leading-relaxed">
              {content.vision.content}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all animate-fade-in-up delay-300">
            <div className="w-16 h-16 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-start text-gray-900">
              {content.mission.title}
            </h2>
            <p className="text-gray-600 text-start leading-relaxed">
              {content.mission.content}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-2xl p-12 shadow-xl animate-fade-in-up delay-400">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {content.values.title}
            </h2>
          </div>
          <ul className="space-y-4">
            {content.values.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-lg text-gray-600">
                <span className="text-[#7c1f26] text-2xl">✓</span>
                <span className="text-start">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
