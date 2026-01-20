import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface ImageUploaderProps {
  onImagesUploaded: (storageIds: Id<"_storage">[]) => void;
  maxImages?: number;
  language: "ar" | "en";
  category: "equipment" | "auctions" | "scrap";
}

export default function ImageUploader({ 
  onImagesUploaded, 
  maxImages = 5, 
  language,
  category 
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(
    category === "equipment" 
      ? api.equipment.generateUploadUrl 
      : category === "auctions"
      ? api.auctions.generateUploadUrl
      : api.scrap.generateUploadUrl
  );

  const t = {
    ar: {
      title: "رفع الصور",
      selectImages: "اختر الصور",
      dragDrop: "أو اسحب الصور هنا",
      maxImages: `الحد الأقصى ${maxImages} صور`,
      uploading: "جاري الرفع...",
      upload: "رفع الصور",
      remove: "حذف",
      success: "تم رفع الصور بنجاح!",
      error: "حدث خطأ أثناء رفع الصور",
      maxReached: `لا يمكن رفع أكثر من ${maxImages} صور`,
    },
    en: {
      title: "Upload Images",
      selectImages: "Select Images",
      dragDrop: "Or drag and drop images here",
      maxImages: `Maximum ${maxImages} images`,
      uploading: "Uploading...",
      upload: "Upload Images",
      remove: "Remove",
      success: "Images uploaded successfully!",
      error: "Error uploading images",
      maxReached: `Cannot upload more than ${maxImages} images`,
    },
  };

  const content = t[language];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (selectedFiles.length + imageFiles.length > maxImages) {
      toast.error(content.maxReached);
      return;
    }

    setSelectedFiles(prev => [...prev, ...imageFiles]);

    // إنشاء معاينات
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const storageIds: Id<"_storage">[] = [];

      for (const file of selectedFiles) {
        // الحصول على رابط الرفع
        const uploadUrl = await generateUploadUrl();

        // رفع الملف
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error("فشل رفع الصورة");
        }

        const { storageId } = await result.json();
        storageIds.push(storageId);
      }

      toast.success(content.success);
      onImagesUploaded(storageIds);
      
      // إعادة تعيين
      setSelectedFiles([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : content.error;
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-start">
        {content.title}
      </h3>

      {/* منطقة الرفع */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#7c1f26] transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-700 font-semibold mb-2">{content.selectImages}</p>
        <p className="text-gray-500 text-sm mb-2">{content.dragDrop}</p>
        <p className="text-gray-400 text-xs">{content.maxImages}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* معاينة الصور */}
      {previews.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 end-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-[#7c1f26] to-[#5a1519] text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? content.uploading : content.upload}
          </button>
        </div>
      )}
    </div>
  );
}
