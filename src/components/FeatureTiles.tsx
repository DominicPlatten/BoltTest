import React from 'react';
import { Image, Building2, Plus, ArrowRight } from 'lucide-react';
import { NavigateFunction } from 'react-router-dom';

interface FeatureTile {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  comingSoon?: boolean;
}

interface FeatureTilesProps {
  onNavigate: NavigateFunction;
}

export function FeatureTiles({ onNavigate }: FeatureTilesProps) {
  const features: FeatureTile[] = [
    {
      title: 'Create Thumbnail',
      description: 'Generate professional thumbnails from your 3D models using Blender',
      icon: <Image className="w-6 h-6" />,
      path: '/thumbnail-creator'
    },
    {
      title: 'Model Contest',
      description: 'Compare different architectural models in the same environment',
      icon: <Building2 className="w-6 h-6" />,
      path: '/model-contest'
    },
    {
      title: 'More Coming Soon',
      description: 'Stay tuned for more exciting features and tools',
      icon: <Plus className="w-6 h-6" />,
      path: '',
      comingSoon: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature) => (
        <div
          key={feature.title}
          className={`relative group overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 ${
            !feature.comingSoon ? 'hover:shadow-lg cursor-pointer' : 'opacity-50'
          }`}
          onClick={() => !feature.comingSoon && onNavigate(feature.path)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                {feature.icon}
              </div>
              {!feature.comingSoon && (
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/5 group-hover:to-blue-500/0 transition-all duration-300" />
        </div>
      ))}
    </div>
  );
}