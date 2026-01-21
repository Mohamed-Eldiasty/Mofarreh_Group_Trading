import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import EquipmentPage from "./pages/EquipmentPage";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";
import ScrapPage from "./pages/ScrapPage";
import ScrapDetailPage from "./pages/ScrapDetailPage";
import AuctionsPage from "./pages/AuctionsPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import { Menu, X, Globe, LogIn } from "lucide-react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function App() {
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const navigation = {
    ar: [
      { name: "الرئيسية", path: "/" },
      { name: "من نحن", path: "/about" },
      { name: "خدماتنا", path: "/services" },
      { name: "المعدات", path: "/equipment" },
      { name: "السكراب", path: "/scrap" },
      { name: "المزادات", path: "/auctions" },
      { name: "تواصل معنا", path: "/contact" },
    ],
    en: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Services", path: "/services" },
      { name: "Equipment", path: "/equipment" },
      { name: "Scrap", path: "/scrap" },
      { name: "Auctions", path: "/auctions" },
      { name: "Contact", path: "/contact" },
    ],
  };

  const navItems = navigation[language];

  return (
    <ConvexAuthProvider client={convex}>
      <Router>
        <div className={`min-h-screen ${language === "ar" ? "font-[Tajawal]" : ""}`} dir={language === "ar" ? "rtl" : "ltr"}>
          <Toaster position={language === "ar" ? "top-left" : "top-right"} richColors />
          
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                  <img 
                    src="https://polished-pony-114.convex.cloud/api/storage/81e91812-d1d2-4b0c-9fa6-91971920acf0" 
                    alt={language === "ar" ? "مجموعة مفرح" : "Mofarreh Group"}
                    className="h-16 w-auto object-contain"
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#7c1f26] to-[#5a1519] bg-clip-text text-transparent">
                    {language === "ar" ? "مجموعة مفرح" : "Mofarreh Group"}
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-gray-700 hover:text-[#7c1f26] font-semibold transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Login Button */}
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7c1f26] to-[#5a1519] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{language === "ar" ? "دخول" : "Login"}</span>
                  </Link>
                  
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="font-semibold">{language === "ar" ? "EN" : "ع"}</span>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>

              {/* Mobile Navigation */}
              {mobileMenuOpen && (
                <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-up">
                  <div className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-[#7c1f26] font-semibold transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                    
                    {/* Mobile Login Button */}
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7c1f26] to-[#5a1519] text-white rounded-lg font-semibold w-fit"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{language === "ar" ? "دخول" : "Login"}</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        toggleLanguage();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors w-fit"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="font-semibold">{language === "ar" ? "English" : "العربية"}</span>
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </header>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<HomePage language={language} />} />
            <Route path="/about" element={<AboutPage language={language} />} />
            <Route path="/services" element={<ServicesPage language={language} />} />
            <Route path="/equipment" element={<EquipmentPage language={language} />} />
            <Route path="/equipment/:slug" element={<EquipmentDetailPage language={language} />} />
            <Route path="/scrap" element={<ScrapPage language={language} />} />
            <Route path="/scrap/:slug" element={<ScrapDetailPage language={language} />} />
            <Route path="/auctions" element={<AuctionsPage language={language} />} />
            <Route path="/contact" element={<ContactPage language={language} />} />
            <Route path="/login" element={<LoginPage language={language} />} />
            <Route path="/admin" element={<AdminDashboard language={language} />} />
          </Routes>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-16 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-start">
                    {language === "ar" ? "مجموعة مفرح" : "Mofarreh Group"}
                  </h3>
                  <p className="text-gray-400 text-start">
                    {language === "ar"
                      ? "قسم التجارة - متخصصون في شراء وبيع المعدات والسكراب"
                      : "Trading Division - Specialized in buying and selling equipment and scrap"}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold mb-4 text-start">
                    {language === "ar" ? "روابط سريعة" : "Quick Links"}
                  </h4>
                  <ul className="space-y-2 text-start">
                    {navItems.slice(0, 4).map((item) => (
                      <li key={item.path}>
                        <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-4 text-start">
                    {language === "ar" ? "خدماتنا" : "Our Services"}
                  </h4>
                  <ul className="space-y-2 text-start text-gray-400">
                    <li>{language === "ar" ? "بيع المعدات" : "Equipment Sales"}</li>
                    <li>{language === "ar" ? "شراء السكراب" : "Scrap Purchase"}</li>
                    <li>{language === "ar" ? "المزادات" : "Auctions"}</li>
                    <li>{language === "ar" ? "الاستشارات" : "Consulting"}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold mb-4 text-start">
                    {language === "ar" ? "تواصل معنا" : "Contact Us"}
                  </h4>
                  <ul className="space-y-2 text-start text-gray-400">
                    <li>{language === "ar" ? "هاتف: " : "Phone: "}+966 55 619 2129</li>
                    <li>{language === "ar" ? "بريد: " : "Email: "}mohamed.eldiasty@mofarrehgroup.com</li>
                    <li>{language === "ar" ? "المنطقة الشرقية، المملكة العربية السعودية" : "Eastern Province, Saudi Arabia"}</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                <p>
                  {language === "ar"
                    ? `© ${new Date().getFullYear()} مجموعة مفرح - قسم التجارة. جميع الحقوق محفوظة.`
                    : `© ${new Date().getFullYear()} Mofarreh Group - Trading Division. All rights reserved.`}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ConvexAuthProvider>
  );
}

export default App;
