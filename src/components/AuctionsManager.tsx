import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Plus, Upload, X, FileText, Trash2, Calendar, MapPin, Tag } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import ImageUploader from "./ImageUploader";

interface AuctionsManagerProps {
  language: "ar" | "en";
}

export default function AuctionsManager({ language }: AuctionsManagerProps) {
  const auctions = useQuery(api.auctions.list, {}) || [];
  const createAuction = useMutation(api.auctions.create);
  const removeAuction = useMutation(api.auctions.remove);
  const generateUploadUrl = useMutation(api.auctions.generateUploadUrl);

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    slug: "",
    status: "upcoming" as "ongoing" | "upcoming" | "ended",
    kind: "in-person" as "in-person" | "online" | "sealed-bid",
    startDate: "",
    endDate: "",
    city: "",
    descriptionAr: "",
    descriptionEn: "",
    termsAr: "",
    termsEn: "",
    mapUrl: "",
  });

  const [heroImage, setHeroImage] = useState<Id<"_storage"> | null>(null);
  const [gallery, setGallery] = useState<Id<"_storage">[]>([]);
  const [attachments, setAttachments] = useState<Array<{
    fileId: Id<"_storage">;
    nameAr: string;
    nameEn: string;
    type: string;
  }>>([]);

  const t = {
    ar: {
      title: "إدارة المزادات",
      addNew: "إضافة مزاد جديد",
      titleAr: "العنوان بالعربي",
      titleEn: "العنوان بالإنجليزي",
      slug: "الرابط (slug)",
      status: "الحالة",
      kind: "النوع",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      city: "المدينة",
      descriptionAr: "الوصف بالعربي",
      descriptionEn: "الوصف بالإنجليزي",
      termsAr: "الشروط بالعربي",
      termsEn: "الشروط بالإنجليزي",
      mapUrl: "رابط الخريطة",
      heroImage: "الصورة الرئيسية",
      gallery: "معرض الصور",
      attachments: "الملفات المرفقة",
      uploadFile: "رفع ملف",
      fileNameAr: "اسم الملف بالعربي",
      fileNameEn: "اسم الملف بالإنجليزي",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      ongoing: "جاري",
      upcoming: "قادم",
      ended: "منتهي",
      inPerson: "حضوري",
      online: "أونلاين",
      sealedBid: "مظاريف مغلقة",
      noAuctions: "لا توجد مزادات",
      uploading: "جاري الرفع...",
      success: "تم الحفظ بنجاح!",
      error: "حدث خطأ",
      confirmDelete: "هل أنت متأكد من الحذف؟",
    },
    en: {
      title: "Manage Auctions",
      addNew: "Add New Auction",
      titleAr: "Title (Arabic)",
      titleEn: "Title (English)",
      slug: "Slug",
      status: "Status",
      kind: "Type",
      startDate: "Start Date",
      endDate: "End Date",
      city: "City",
      descriptionAr: "Description (Arabic)",
      descriptionEn: "Description (English)",
      termsAr: "Terms (Arabic)",
      termsEn: "Terms (English)",
      mapUrl: "Map URL",
      heroImage: "Hero Image",
      gallery: "Gallery",
      attachments: "Attachments",
      uploadFile: "Upload File",
      fileNameAr: "File Name (Arabic)",
      fileNameEn: "File Name (English)",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      ongoing: "Ongoing",
      upcoming: "Upcoming",
      ended: "Ended",
      inPerson: "In-Person",
      online: "Online",
      sealedBid: "Sealed Bid",
      noAuctions: "No auctions",
      uploading: "Uploading...",
      success: "Saved successfully!",
      error: "An error occurred",
      confirmDelete: "Are you sure you want to delete?",
    },
  };

  const content = t[language];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.info(content.uploading);
      
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");

      const { storageId } = await result.json();
      
      const fileType = file.type.includes("pdf") ? "pdf" 
        : file.type.includes("excel") || file.type.includes("spreadsheet") ? "excel"
        : file.type.includes("word") ? "word"
        : "other";

      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      setAttachments([...attachments, {
        fileId: storageId,
        nameAr: fileName,
        nameEn: fileName,
        type: fileType,
      }]);

      toast.success(language === "ar" ? "تم رفع الملف!" : "File uploaded!");
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(content.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!heroImage) {
      toast.error(language === "ar" ? "يجب إضافة صورة رئيسية" : "Hero image is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await createAuction({
        ...formData,
        startDate: new Date(formData.startDate).getTime(),
        endDate: new Date(formData.endDate).getTime(),
        heroImage,
        gallery,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      toast.success(content.success);
      setShowForm(false);
      resetForm();
    } catch (error) {
      toast.error(content.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titleAr: "",
      titleEn: "",
      slug: "",
      status: "upcoming",
      kind: "in-person",
      startDate: "",
      endDate: "",
      city: "",
      descriptionAr: "",
      descriptionEn: "",
      termsAr: "",
      termsEn: "",
      mapUrl: "",
    });
    setHeroImage(null);
    setGallery([]);
    setAttachments([]);
  };

  const handleDelete = async (id: Id<"auctions">) => {
    if (!confirm(content.confirmDelete)) return;

    try {
      await removeAuction({ id });
      toast.success(language === "ar" ? "تم الحذف" : "Deleted");
    } catch (error) {
      toast.error(content.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          {content.addNew}
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 space-y-6 border-2 border-[#d4af37]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.titleAr}
              </label>
              <input
                type="text"
                value={formData.titleAr}
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.titleEn}
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.slug}
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.city}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.status}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
              >
                <option value="upcoming">{content.upcoming}</option>
                <option value="ongoing">{content.ongoing}</option>
                <option value="ended">{content.ended}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.kind}
              </label>
              <select
                value={formData.kind}
                onChange={(e) => setFormData({ ...formData, kind: e.target.value as any })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
              >
                <option value="in-person">{content.inPerson}</option>
                <option value="online">{content.online}</option>
                <option value="sealed-bid">{content.sealedBid}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.startDate}
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.endDate}
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              {content.descriptionAr}
            </label>
            <textarea
              value={formData.descriptionAr}
              onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              {content.descriptionEn}
            </label>
            <textarea
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              {content.heroImage}
            </label>
            <ImageUploader
              onImagesUploaded={(ids) => setHeroImage(ids[0])}
              language={language}
              category="auctions"
              maxImages={1}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              {content.gallery}
            </label>
            <ImageUploader
              onImagesUploaded={(ids) => setGallery([...gallery, ...ids])}
              language={language}
              category="auctions"
              maxImages={10}
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
              {content.attachments}
            </label>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {content.uploadFile}
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((att, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-200">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={att.nameAr}
                          onChange={(e) => {
                            const newAttachments = [...attachments];
                            newAttachments[index].nameAr = e.target.value;
                            setAttachments(newAttachments);
                          }}
                          placeholder={content.fileNameAr}
                          className="w-full px-3 py-2 rounded border border-gray-300 mb-2"
                        />
                        <input
                          type="text"
                          value={att.nameEn}
                          onChange={(e) => {
                            const newAttachments = [...attachments];
                            newAttachments[index].nameEn = e.target.value;
                            setAttachments(newAttachments);
                          }}
                          placeholder={content.fileNameEn}
                          className="w-full px-3 py-2 rounded border border-gray-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? content.uploading : content.save}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              {content.cancel}
            </button>
          </div>
        </form>
      )}

      {/* Auctions List */}
      <div className="grid grid-cols-1 gap-6">
        {auctions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">{content.noAuctions}</p>
        ) : (
          auctions.map((auction) => (
            <div key={auction._id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-[#d4af37] transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-start">
                    {language === "ar" ? auction.titleAr : auction.titleEn}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-[#d4af37]/10 text-[#d4af37] rounded-full text-sm font-semibold">
                      {content[auction.status as keyof typeof content]}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {content[auction.kind.replace("-", "") as keyof typeof content]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(auction.startDate).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {auction.city}
                    </div>
                    {auction.attachments && auction.attachments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {auction.attachments.length} {language === "ar" ? "ملف" : "files"}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(auction._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
