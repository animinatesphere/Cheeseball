import React, { useState } from "react";
import { ArrowLeft, Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const GiftCardUpload = ({ onBack, onContinue, transactionData }) => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [frontUploading, setFrontUploading] = useState(false);
  const [backUploading, setBackUploading] = useState(false);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'front') setFrontPreview(reader.result);
      else setBackPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Storage
    try {
      if (type === 'front') setFrontUploading(true);
      else setBackUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `giftcards/${fileName}`;

      const { data, error } = await supabase.storage
        .from('transaction-proofs')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('transaction-proofs')
        .getPublicUrl(filePath);

      if (type === 'front') setFrontImage(publicUrl);
      else setBackImage(publicUrl);

    } catch (error) {
      console.error('Error uploading image:', error.message);
      alert('Failed to upload image. Please try again.');
    } finally {
      if (type === 'front') setFrontUploading(false);
      else setBackUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-24">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button onClick={onBack} className="mb-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Upload Images</h1>
          <p className="text-blue-200 font-medium">Please provide clear photos of your {transactionData?.cardName || 'Gift Card'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Front Side */}
            <div className="space-y-4">
              <label className="block text-gray-400 font-black uppercase text-xs tracking-widest px-2">Front Side</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'front')}
                  className="hidden"
                  id="front-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="front-upload"
                  className={`w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    frontPreview ? "border-green-400 bg-green-50" : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50"
                  } relative overflow-hidden`}
                >
                  {frontPreview ? (
                    <div className="relative w-full h-full p-2">
                       <img src={frontPreview} alt="Front" className="w-full h-full object-cover rounded-2xl shadow-lg" />
                       {frontUploading ? (
                         <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                         </div>
                       ) : frontImage && (
                         <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full"><CheckCircle2 size={16}/></div>
                       )}
                    </div>
                  ) : (
                    <>
                      <Upload className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                      <span className="text-xs font-bold text-gray-400">Click to upload front</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Back Side */}
            <div className="space-y-4">
              <label className="block text-gray-400 font-black uppercase text-xs tracking-widest px-2">Back Side (Code)</label>
              <div className="relative group">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'back')}
                  className="hidden"
                  id="back-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="back-upload"
                  className={`w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    backPreview ? "border-green-400 bg-green-50" : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50"
                  } relative overflow-hidden`}
                >
                  {backPreview ? (
                    <div className="relative w-full h-full p-2">
                       <img src={backPreview} alt="Back" className="w-full h-full object-cover rounded-2xl shadow-lg" />
                       {backUploading ? (
                         <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                         </div>
                       ) : backImage && (
                         <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full"><CheckCircle2 size={16}/></div>
                       )}
                    </div>
                  ) : (
                    <>
                      <Upload className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                      <span className="text-xs font-bold text-gray-400">Click to upload back</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4 mb-10">
            <FileText className="text-blue-600 shrink-0 mt-1" />
            <p className="text-sm text-blue-900 font-medium">
              Ensure the code is clearly visible and the card is not scratched out too much. Blurry images will be rejected.
            </p>
          </div>

          <button
            onClick={() => onContinue({ frontImage, backImage })}
            disabled={!frontImage || !backImage}
            className="w-full bg-[#0063BF] hover:bg-blue-700 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            <span>Confirm Upload</span>
            <ArrowLeft className="w-6 h-6 rotate-180 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftCardUpload;
