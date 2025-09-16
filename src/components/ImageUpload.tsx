import React, { useState, useRef } from 'react';
import { apiService } from '../services/api';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  initialImageUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, initialImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const result = await apiService.uploadImage(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size));
        setProgress(percentCompleted);
      });
      onUploadSuccess(result.url);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "L'upload a échoué.");
      } else {
        setError("Une erreur inconnue est survenue.");
      }
      setPreview(initialImageUrl || null); // Revert preview on error
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group" onClick={triggerFileInput} style={{ cursor: 'pointer' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        aria-label="Télécharger une image"
        title="Télécharger une image"
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
        disabled={uploading}
      />
      {preview ? (
        <img src={preview} alt="Aperçu" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 group-hover:opacity-75 transition-opacity" />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400 group-hover:bg-gray-300 transition-colors">
          <i className="fas fa-camera text-gray-500 text-2xl"></i>
        </div>
      )}

      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white text-sm font-bold">Changer</span>
      </div>

      {uploading && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <span className="text-white font-bold">{progress}%</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute -bottom-6 left-0 w-full text-center">
          <p className="text-red-500 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;