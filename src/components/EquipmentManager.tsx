import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";
import { Id } from "../../convex/_generated/dataModel";

interface EquipmentManagerProps {
  language: "ar" | "en";
}

export default function EquipmentManager({ language }: EquipmentManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Id<"_storage">[]>([]);
  
  const equipment = useQuery(api.equipment.list, {});
  const createEquipment = useMutation(api.equipment.create);
  const removeEquipment = useMutation(api.equipment.remove);

  const [formData, setFormData] = useState({
    titleAr: "",
    titleEn: "",
    slug: "",
    condition: "used" as const,
    price: 0,
    currency: "SAR",
    city: "",
    descriptionAr: "",
    descriptionEn: "",
    featured: false,
    status: "active" as const,
  });

  const t = {
    ar: {
      title: "إدارة المعدات",
      addNew: "إضافة معدة جديدة",
      noItems: "لا توجد معدات",
      titleAr: "العنوان بالعربية",
      titleEn: "العنوان بالإنجليزية",
      slug: "الرابط (slug)",
      condition: "الحالة",
      price: "السعر",
      city: "المدينة",
      descriptionAr: "الوصف بالعربية",
      descriptionEn: "الوصف بالإنجليزية",
      featured: "مميز",
      status: "الحالة",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      success: "تم الحفظ بنجاح!",
      deleteSuccess: "تم الحذف بنجاح!",
      error: "حدث خطأ",
      conditions: {
        new: "جديد",
        used: "مستعمل",
        excellent: "ممتاز",
      },
      statuses: {
        active: "نشط",
        sold: "مباع",
        pending: "قيد الانتظار",
      },
    },
    en: {
      title: "Equipment Management",
      addNew: "Add New Equipment",
      noItems: "No equipment found",
      titleAr: "Title (Arabic)",
      titleEn: "Title (English)",
      slug: "Slug",
      condition: "Condition",
      price: "Price",
      city: "City",
      descriptionAr: "Description (Arabic)",
      descriptionEn: "Description (English)",
      featured: "Featured",
      status: "Status",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      success: "Saved successfully!",
      deleteSuccess: "Deleted successfully!",
      error: "An error occurred",
      conditions: {
        new: "New",
        used: "Used",
        excellent: "Excellent",
      },
      statuses: {
        active: "Active",
        sold: "Sold",
        pending: "Pending",
      },
    },
  };

  const content = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEquipment({
        ...formData,
        images: uploadedImages,
        specs: [],
      });
      toast.success(content.success);
      setShowForm(false);
      setFormData({
        titleAr: "",
        titleEn: "",
        slug: "",
        condition: "used",
        price: 0,
        currency: "SAR",
        city: "",
        descriptionAr: "",
        descriptionEn: "",
        featured: false,
        status: "active",
      });
      setUploadedImages([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : content.error;
      toast.error(message);
    }
  };

  const handleDelete = async (id: Id<"equipment">) => {
    try {
      await removeEquipment({ id });
      toast.success(content.deleteSuccess);
    } catch (error) {
      const message = error instanceof Error ? error.message : content.error;
      toast.error(message);
    }
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
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.titleAr}
                </label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.titleEn}
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.slug}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.condition}
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                >
                  <option value="new">{content.conditions.new}</option>
                  <option value="used">{content.conditions.used}</option>
                  <option value="excellent">{content.conditions.excellent}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.price}
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                  {content.city}
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {content.descriptionAr}
              </label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                {content.descriptionEn}
              </label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#7c1f26] focus:ring-2 focus:ring-[#7c1f26]/20 transition-all"
              />
            </div>

            {/* Image Uploader */}
            <ImageUploader
              onImagesUploaded={setUploadedImages}
              maxImages={5}
              language={language}
              category="equipment"
            />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-[#7c1f26] rounded focus:ring-[#7c1f26]"
                />
                <span className="text-sm font-medium text-gray-700">{content.featured}</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#7c1f26] to-[#5a1519] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                {content.save}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all"
              >
                {content.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {equipment === undefined ? (
          <div className="p-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : equipment.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{content.noItems}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-b from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-semibold text-gray-700 uppercase">
                    {language === "ar" ? "العنوان" : "Title"}
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-semibold text-gray-700 uppercase">
                    {content.city}
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-semibold text-gray-700 uppercase">
                    {content.price}
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-semibold text-gray-700 uppercase">
                    {content.status}
                  </th>
                  <th className="px-6 py-3 text-end text-xs font-semibold text-gray-700 uppercase">
                    {language === "ar" ? "إجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipment.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {language === "ar" ? item.titleAr : item.titleEn}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {item.price?.toLocaleString()} {item.currency}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === "active" 
                          ? "bg-green-100 text-green-800"
                          : item.status === "sold"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {content.statuses[item.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end text-sm">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        <Trash2 className="w-5 h-5" />
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
