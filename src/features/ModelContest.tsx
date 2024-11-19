import React from 'react';
import { FileUpload } from '../components/FileUpload';
import { ModelViewer } from '../components/ModelViewer';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ModelContest() {
  const [environmentFile, setEnvironmentFile] = React.useState<File | null>(null);
  const [variants, setVariants] = React.useState<File[]>([]);
  const [selectedVariant, setSelectedVariant] = React.useState<number | null>(null);
  const navigate = useNavigate();

  const handleEnvironmentUpload = (file: File) => {
    setEnvironmentFile(file);
  };

  const handleVariantUpload = (file: File) => {
    setVariants(prev => [...prev, file]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
    if (selectedVariant === index) {
      setSelectedVariant(null);
    } else if (selectedVariant !== null && selectedVariant > index) {
      setSelectedVariant(selectedVariant - 1);
    }
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

      {!environmentFile ? (
        <div className="space-y-4">
          <div className="text-center">
            <Building2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">Upload Environment Model</h2>
            <p className="text-gray-600">Start by uploading the base environment model (e.g., street, landscape)</p>
          </div>
          <div className="flex justify-center">
            <FileUpload onFileSelect={handleEnvironmentUpload} />
          </div>
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="flex-1">
            <ModelViewer 
              modelFile={environmentFile}
              variantFile={selectedVariant !== null ? variants[selectedVariant] : undefined}
            />
          </div>
          
          <div className="w-80 flex flex-col gap-4">
            {variants.length < 5 && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Add Variant</h3>
                <FileUpload onFileSelect={handleVariantUpload} />
              </div>
            )}
            
            {variants.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Model Variants</h3>
                <div className="space-y-2">
                  {variants.map((variant, index) => (
                    <div
                      key={index}
                      className={`relative group cursor-pointer rounded-lg ${
                        selectedVariant === index 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50 border border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                      } transition-colors p-3`}
                      onClick={() => setSelectedVariant(index)}
                    >
                      <div className="pr-8">
                        <span className="block text-gray-900 font-medium truncate">
                          Variant {index + 1}
                        </span>
                        <span className="text-sm text-gray-500 truncate block">
                          {variant.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveVariant(index);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}