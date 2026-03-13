import React, { useState } from "react";
import { Upload, X, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const ScreenshotUpload = ({ onUploadComplete, label = "Upload Payment Receipt" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setSuccess(false);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `screenshots/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('transaction-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('transaction-proofs')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      setSuccess(true);
    } catch (error) {
      console.error('Error uploading screenshot:', error.message);
      alert('Failed to upload screenshot. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearUpload = () => {
    setPreview(null);
    setSuccess(false);
    onUploadComplete(null);
  };

  return (
    <div className="space-y-4">
      <label className="text-gray-400 font-black uppercase text-[10px] sm:text-xs tracking-widest px-2 block">{label}</label>
      
      {!preview ? (
        <div className="relative group">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="screenshot-input"
            accept="image/*"
          />
          <label
            htmlFor="screenshot-input"
            className="w-full h-40 border-2 border-dashed border-gray-200 rounded-[2rem] bg-white flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <Upload className="text-gray-300 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
            <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600">Select screenshot or photo</span>
          </label>
        </div>
      ) : (
        <div className="relative rounded-[2rem] overflow-hidden border-2 border-blue-100 shadow-xl group h-48">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={clearUpload}
              className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {uploading && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Uploading...</span>
             </div>
          )}

          {success && (
             <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-xl shadow-lg animate-bounce-in">
                <CheckCircle2 size={16} />
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScreenshotUpload;
