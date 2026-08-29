import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

interface CameraUploadProps {
  photoUrl: string;
  onPhotoChange: (url: string) => void;
}

const SAMPLE_ROAD_PHOTOS = [
  {
    title: 'GT Road Pothole',
    url: '/demo-images/pothole-1.jpg',
    type: 'Pothole',
  },
  {
    title: 'Paver Trench',
    url: '/demo-images/pothole-2.jpg',
    type: 'Road Damage',
  },
  {
    title: 'Rural Mud Road',
    url: '/demo-images/rural-mud-road.jpg',
    type: 'Road Damage',
  },
  {
    title: 'Clogged Waterlogging',
    url: '/demo-images/waterlogged-street.jpg',
    type: 'Waterlogging',
  },
];

export const CameraUpload: React.FC<CameraUploadProps> = ({ photoUrl, onPhotoChange }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onPhotoChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Box / Preview */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-[#F97316] bg-orange-50/50'
            : photoUrl
            ? 'border-emerald-300 bg-slate-50'
            : 'border-slate-300 hover:border-[#123C69] bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {photoUrl ? (
          <div className="space-y-3">
            <div className="relative max-h-64 rounded-xl overflow-hidden shadow-sm mx-auto max-w-md">
              <img
                src={photoUrl}
                alt="Captured road issue"
                className="w-full h-full object-cover max-h-64 rounded-xl"
              />
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow">
                <Check className="w-3.5 h-3.5" /> Photo Attached
              </div>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Click or drag to replace photo
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#F97316] flex items-center justify-center shadow-inner">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#123C69]">
                Take a photo or upload road image
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Drag and drop image here, or browse from device
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#123C69] text-white text-xs font-bold shadow-xs">
              <Upload className="w-3.5 h-3.5" /> Select Image File
            </span>
          </div>
        )}
      </div>

      {/* Quick Sample Presets for Testing */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
          <span>Quick Demo: Choose from sample road hazard images</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_ROAD_PHOTOS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPhotoChange(sample.url)}
              className={`relative rounded-lg overflow-hidden border p-1 text-left transition-all ${
                photoUrl === sample.url
                  ? 'border-[#F97316] ring-2 ring-orange-200 bg-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              <img
                src={sample.url}
                alt={sample.title}
                className="w-full h-16 object-cover rounded-md"
              />
              <div className="mt-1">
                <span className="text-[11px] font-bold text-slate-800 block truncate">
                  {sample.title}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{sample.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
