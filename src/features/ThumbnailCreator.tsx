import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { ModelViewer } from '../components/ModelViewer';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AuthModal } from '../components/AuthModal';

interface Thumbnail {
  id: string;
  dataUrl: string;
  createdAt: Date;
}

export function ThumbnailCreator() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleFileSelect = (file: File) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setUploadedFile(file);
  };

  const handleThumbnailCapture = (dataUrl: string) => {
    const newThumbnail: Thumbnail = {
      id: Date.now().toString(),
      dataUrl,
      createdAt: new Date()
    };
    setThumbnails(prev => [newThumbnail, ...prev]);
  };

  const handleThumbnailDownload = (thumbnail: Thumbnail) => {
    const link = document.createElement('a');
    link.href = thumbnail.dataUrl;
    link.download = `thumbnail-${thumbnail.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {!uploadedFile ? (
        <div className="flex justify-center">
          <FileUpload onFileSelect={handleFileSelect} />
        </div>
      ) : (
        <>
          <ModelViewer 
            modelFile={uploadedFile}
            showThumbnailButton
            onThumbnailCapture={handleThumbnailCapture}
          />

          {thumbnails.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Thumbnails</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {thumbnails.map((thumbnail) => (
                  <div key={thumbnail.id} className="relative group">
                    <img
                      src={thumbnail.dataUrl}
                      alt={`Thumbnail ${thumbnail.id}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleThumbnailDownload(thumbnail)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <Download className="w-6 h-6 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}