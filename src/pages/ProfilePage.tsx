import React from 'react';
import { useAuthStore } from '../store/authStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ModelViewer } from '../components/ModelViewer';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SavedModel {
  id: string;
  name: string;
  thumbnailUrl: string;
  modelUrl: string;
  createdAt: Date;
}

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [savedModels, setSavedModels] = React.useState<SavedModel[]>([]);
  const [selectedModel, setSelectedModel] = React.useState<SavedModel | null>(null);

  React.useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const loadSavedModels = async () => {
      const q = query(
        collection(db, 'models'),
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const models: SavedModel[] = [];
      
      querySnapshot.forEach((doc) => {
        models.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        } as SavedModel);
      });

      setSavedModels(models);
    };

    loadSavedModels();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex items-center space-x-4 mb-8">
        <img
          src={user.photoURL || ''}
          alt={user.displayName || 'User'}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.displayName}
          </h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedModels.map((model) => (
          <div
            key={model.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="aspect-video bg-gray-100">
              {selectedModel?.id === model.id ? (
                <ModelViewer modelData={new ArrayBuffer(0)} />
              ) : (
                <img
                  src={model.thumbnailUrl}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
              <p className="text-sm text-gray-500">
                {model.createdAt.toLocaleDateString()}
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setSelectedModel(model)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  View Model
                </button>
                <button className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}