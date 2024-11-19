import React from 'react';
import { Trash2 } from 'lucide-react';
import type { StoredModel } from '../lib/db';

interface ModelListProps {
  models: StoredModel[];
  onSelect: (model: StoredModel) => void;
  onDelete: (id: number | undefined) => void;
}

export function ModelList({ models, onSelect, onDelete }: ModelListProps) {
  if (models.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Previous Uploads</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {models.map((model) => (
          <li key={model.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
            <button
              onClick={() => onSelect(model)}
              className="flex-1 flex items-center text-left"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{model.name}</p>
                <p className="text-sm text-gray-500">
                  {model.createdAt.toLocaleDateString()} •{' '}
                  {(model.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </button>
            <button
              onClick={() => onDelete(model.id)}
              className="ml-4 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}