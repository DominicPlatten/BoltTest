import React, { useCallback, useState } from 'react';
import { Upload, FileWarning } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    // Currently, we'll focus on GLB/GLTF as they're most reliable
    const validTypes = ['.glb', '.gltf'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      setError('Please upload a GLB or GLTF file');
      return false;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const { files } = e.dataTransfer;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        onFileSelect(files[0]);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`w-full max-w-xl p-8 rounded-xl transition-all duration-200 ${
        isDragging
          ? 'bg-blue-50 border-2 border-blue-400 border-dashed'
          : 'bg-white border-2 border-gray-200 border-dashed'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Upload
          className={`w-12 h-12 ${
            isDragging ? 'text-blue-500' : 'text-gray-400'
          }`}
        />
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            Drag and drop your 3D file here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Supports GLB and GLTF files up to 50MB
          </p>
        </div>
        
        <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
          Select File
          <input
            type="file"
            className="hidden"
            accept=".glb,.gltf"
            onChange={handleFileInput}
          />
        </label>

        {error && (
          <div className="flex items-center space-x-2 text-red-500">
            <FileWarning className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}