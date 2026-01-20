import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Plus, Trash2, Package, MapPin, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";

interface ScrapManagerProps {
  language: "ar" | "en";
}

export default function ScrapManager({ language }: ScrapManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Id<"_storage">[]>([]);
  const [specs, setSpecs] = useState<Array<{ labelAr: string; labelEn: string; value: string }>>([
    { labelAr: "", labelEn: "", value: "" }
  ]);

  const scrapList = useQuery(api.scrap.list, {});
  const createScrap = useMutation(api.scrap.create);
  const removeScrap = useMutation(api.scrap.remove);

  const t = {
    ar: {
      title: "إدارة السكراب",
      addNew: "إضافة سكراب جديد",
      form: {
        titleAr: "العنوان بالعربية",
        titleEn: "العنوان بالإنجليزية",
        slug: "الرابط (slug)",
        city: "المدينة",
        descriptionAr: "الوصف بالعربية",
        descriptionEn: "الوصف بالإنجليزية",
        priceNote: "ملاحظة السعر",
        status: "الحالة",
        active: "متاح",
        sold: "مباع",
        specs: "المواصفات",
        addSpec: "إضافة مواصفة",
        specLabelAr: "اسم المواصفة (عربي)",
        specLabelEn: "اسم المواصفة (إنجليزي)",
        specValue: "القيمة",
        removeSpec: "حذف",
        images: "الصور",
        submit: "إضافة السكراب",
        cancel: "إلغاء",
      },
      list: {
        noItems: "لا توجد عناصر سكراب",
        addFirst: "أضف أول عنصر سكراب الآن",
        delete: "حذف",
        confirmDelete: "هل أنت متأكد من حذف هذا العنصر؟",
      },
      messages: {
        success: "تم إضافة السكراب بنجاح!",
        deleted: "تم حذف السكراب بنجاح!",
        error: "حدث خطأ",
        fillRequired: "يرجى ملء جميع الحقول المطلوبة",
        uploadImages: "يرجى رفع صورة واحدة على الأقل",
      },
    },
    en: {
      title: "Scrap Management",
      addNew: "Add New Scrap",
      form: {
        titleAr: "Title (Arabic)",
        titleEn: "Title (English)",
        slug: "Slug",
        city: "City",
        descriptionAr: "Description (Arabic)",
        descriptionEn: "Description (English)",
        priceNote: "Price Note",
        status: "Status",
        active: "Active",
        sold: "Sold",
        specs: "Specifications",
        addSpec: "Add Specification",
        specLabelAr: "Spec Name (Arabic)",
        specLabelEn: "Spec Name (English)",
        specValue: "Value",
        removeSpec: "Remove",
        images: "Images",
        submit: "Add Scrap",
        cancel: "Cancel",
      },
      list: {
        noItems: "No scrap items",
        addFirst: "Add your first scrap item now",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete this item?",
      },
      messages: {
        success: "Scrap added successfully!",
        deleted: "Scrap deleted successfully!",
        error: "An error occurred",
        fillRequired: "Please fill all required fields",
        uploadImages: "Please upload at least one image",
      },
    },
  };

  const content = t[language];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const titleAr = formData.get("titleAr") as string;
    const titleEn = formData.get("titleEn") as string;
    const slug = formData.get("slug") as string;
    const city = formData.get("city") as string;
    const status = formData.get("status") as "active" | "sold";
    const descriptionAr = formData.get("descriptionAr") as string;
    const descriptionEn = formData.get("descriptionEn") as string;
    const priceNote = formData.get("priceNote") as string;

    if (!titleAr || !titleEn || !slug || !city) {
      toast.error(content.messages.fillRequired);
      return;
    }

    if (uploadedImages.length === 0) {
      toast.error(content.messages.uploadImages);
      return;
    }

    // تصفية المواصفات الفارغة
    const validSpecs = specs.filter(
      (spec) => spec.labelAr && spec.labelEn && spec.value
    );

    try {
      await createScrap({
        titleAr,
        titleEn,
        slug,
        city,
        status,
        descriptionAr: descriptionAr || undefined,
        descriptionEn: descriptionEn || undefined,
        priceNote: priceNote || undefined,
        specs: validSpecs,
        images: uploadedImages,
      });

      toast.success(content.messages.success);
      setShowForm(false);
      setUploadedImages([]);
      setSpecs([{ labelAr: "", labelEn: "", value: "" }]);
      e.currentTarget.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : content.messages.error;
      toast.error(message);
    }
  };

  const handleDelete = async (id: Id<"scrap">) => {
    if (!confirm(content.list.confirmDelete)) return;

    try {
      await removeScrap({ id });
      toast.success(content.messages.deleted);
    } catch (error) {
      const message = error instanceof Error ? error.message : content.messages.error;
      toast.error(message);
    }
  };

  const addSpec = () => {
    setSpecs([...specs, { labelAr: "", labelEn: "", value: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: "labelAr" | "labelEn" | "value", value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 text-start">
          {content.title}
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c1f26] to-[#5a1519] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          {content.addNew}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* العنوان بالعربية */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  {content.form.titleAr}
                </label>
                <input
                  type="text"
                  name="titleAr"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                />
              </div>

              {/* العنوان بالإنجليزية */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  {content.form.titleEn}
                </label>
                <input
                  type="text"
                  name="titleEn"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  {content.form.slug}
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                />
              </div>

              {/* المدينة */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  {content.form.city}
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                />
              </div>

              {/* الحالة */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  {content.form.status}
                </label>
                <select
                  name="status"
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                >
                  <option value="active">{content.form.active}</option>
                  <option value="sold">{content.form.sold}</option>
                </select>
              </div>

              {/* ملاحظة السعر */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  {content.form.priceNote}
                </label>
                <input
                  type="text"
                  name="priceNote"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                />
              </div>
            </div>

            {/* الوصف بالعربية */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.form.descriptionAr}
              </label>
              <textarea
                name="descriptionAr"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
              />
            </div>

            {/* الوصف بالإنجليزية */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                {content.form.descriptionEn}
              </label>
              <textarea
                name="descriptionEn"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
              />
            </div>

            {/* المواصفات */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-700 text-start">
                  {content.form.specs}
                </label>
                <button
                  type="button"
                  onClick={addSpec}
                  className="text-[#7c1f26] font-semibold hover:underline"
                >
                  + {content.form.addSpec}
                </button>
              </div>
              <div className="space-y-4">
                {specs.map((spec, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      placeholder={content.form.specLabelAr}
                      value={spec.labelAr}
                      onChange={(e) => updateSpec(index, "labelAr", e.target.value)}
                      className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                    />
                    <input
                      type="text"
                      placeholder={content.form.specLabelEn}
                      value={spec.labelEn}
                      onChange={(e) => updateSpec(index, "labelEn", e.target.value)}
                      className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={content.form.specValue}
                        value={spec.value}
                        onChange={(e) => updateSpec(index, "value", e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                      />
                      {specs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpec(index)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          {content.form.removeSpec}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* رفع الصور */}
            <ImageUploader
              onImagesUploaded={setUploadedImages}
              maxImages={10}
              language={language}
              category="scrap"
            />

            {/* الأزرار */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#7c1f26] to-[#5a1519] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                {content.form.submit}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                {content.form.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* قائمة السكراب */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {scrapList === undefined ? (
          <div className="p-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : scrapList.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {content.list.noItems}
            </h3>
            <p className="text-gray-600">{content.list.addFirst}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-b from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-700 uppercase">
                    {language === "ar" ? "العنوان" : "Title"}
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-700 uppercase">
                    {language === "ar" ? "المدينة" : "City"}
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-700 uppercase">
                    {language === "ar" ? "الحالة" : "Status"}
                  </th>
                  <th className="px-6 py-4 text-start text-xs font-semibold text-gray-700 uppercase">
                    {language === "ar" ? "الصور" : "Images"}
                  </th>
                  <th className="px-6 py-4 text-end text-xs font-semibold text-gray-700 uppercase">
                    {language === "ar" ? "إجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {scrapList.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-start">
                        {language === "ar" ? item.titleAr : item.titleEn}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {item.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status === "active" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {item.status === "active" ? content.form.active : content.form.sold}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {item.imageUrls.slice(0, 3).map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt=""
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ))}
                        {item.imageUrls.length > 3 && (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-600">
                            +{item.imageUrls.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        {content.list.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
