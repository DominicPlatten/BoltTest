import React from 'react';
import { FeatureTiles } from './components/FeatureTiles';
import { ThumbnailCreator } from './features/ThumbnailCreator';
import { ModelContest } from './features/ModelContest';
import { AccountPage } from './pages/AccountPage';
import { Box } from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { UserMenu } from './components/UserMenu';

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-900 hover:text-blue-500 transition-colors"
          >
            <Box className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-semibold">3D Model Tools</span>
          </button>
          <UserMenu />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<FeatureTiles onNavigate={navigate} />} />
            <Route path="/thumbnail-creator" element={<ThumbnailCreator />} />
            <Route path="/model-contest" element={<ModelContest />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}