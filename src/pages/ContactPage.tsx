import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";

interface ContactPageProps {
  language: "ar" | "en";
}

export default function ContactPage({ language }: ContactPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = useMutation(api.contact.send);

  const t = {
    ar: {
      title: "تواصل معنا",
      subtitle: "نحن هنا للإجابة على استفساراتكم",
      form: {
        name: "الاسم",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف (اختياري)",
        message: "الرسالة",
        send: "إرسال",
        sending: "جاري الإرسال...",
      },
      contact: {
        phone: "الهاتف",
        email: "البريد الإلكتروني",
        address: "العنوان",
        addressText: "المنطقة الشرقية، المملكة العربية السعودية",
      },
      success: "تم إرسال رسالتك بنجاح!",
      error: "حدث خطأ أثناء إرسال الرسالة",
    },
    en: {
      title: "Contact Us",
      subtitle: "We're here to answer your questions",
      form: {
        name: "Name",
        email: "Email",
        phone: "Phone (optional)",
        message: "Message",
        send: "Send",
        sending: "Sending...",
      },
      contact: {
        phone: "Phone",
        email: "Email",
        address: "Address",
        addressText: "Eastern Province, Saudi Arabia",
      },
      success: "Your message has been sent successfully!",
      error: "An error occurred while sending the message",
    },
  };

  const content = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendMessage({
        name,
        email,
        phone: phone || undefined,
        message,
      });
      
      toast.success(content.success);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      toast.error(content.error);
    } finally {
      setLoading(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in-up delay-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.form.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.form.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.form.phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.form.message}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#7c1f26] to-[#5a1519] hover:from-[#5a1519] hover:to-[#7c1f26] text-white rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {loading ? content.form.sending : content.form.send}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in-up delay-200">
            {/* Phone */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#7c1f26] to-[#5a1519] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-start text-gray-900">
                    {content.contact.phone}
                  </h3>
                  <a
                    href="tel:+966556192129"
                    className="text-lg text-[#7c1f26] hover:underline"
                    dir="ltr"
                  >
                    +966 55 619 2129
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-start text-gray-900">
                    WhatsApp
                  </h3>
                  <a
                    href="https://wa.me/966556192129"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-green-600 hover:underline"
                    dir="ltr"
                  >
                    +966 55 619 2129
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-start text-gray-900">
                    {content.contact.email}
                  </h3>
                  <a
                    href="mailto:mohamed.eldiasty@mofarrehgroup.com"
                    className="text-lg text-blue-600 hover:underline break-all"
                  >
                    mohamed.eldiasty@mofarrehgroup.com
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-start text-gray-900">
                    {content.contact.address}
                  </h3>
                  <p className="text-lg text-gray-600 text-start mb-3">
                    {content.contact.addressText}
                  </p>
                  <a
                    href="https://maps.app.goo.gl/wrRLXdKGMSAgHkEi9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#d4af37] hover:underline font-semibold"
                  >
                    {language === "ar" ? "عرض على الخريطة" : "View on Map"}
                    <MapPin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
