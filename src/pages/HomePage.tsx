import { siteData } from "../data";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-right" dir="rtl">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#7c1f26]">{siteData.settings.logoName}</div>
          <div className="hidden md:flex space-x-reverse space-x-8 font-medium">
            <a href="#about" className="hover:text-[#7c1f26]">من نحن</a>
            <a href="#services" className="hover:text-[#7c1f26]">خدماتنا</a>
            <a href="#contact" className="bg-[#7c1f26] text-white px-5 py-2 rounded-full">اتصل بنا</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 bg-gradient-to-b from-gray-50 to-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            {siteData.settings.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {siteData.settings.description}
          </p>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {siteData.services.map((service, i) => (
          <div key={i} className="p-10 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
            <p className="text-gray-500 leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">تواصل معنا</h2>
          <p className="mb-2">{siteData.settings.contactPhone}</p>
          <p>{siteData.settings.contactEmail}</p>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500 text-sm">
            © {new Date().getFullYear()} {siteData.settings.logoName}. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </div>
  );
}