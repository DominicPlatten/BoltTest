import React, { useState } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { AuthModal } from './AuthModal';

export function UserMenu() {
  const { user, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          <User className="w-5 h-5" />
          <span>Sign In</span>
        </button>

        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {user.displayName?.[0] || user.email?.[0] || 'U'}
          </div>
        )}
        <span>{user.displayName || user.email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <Link
            to="/account"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" />
            <span>Account Settings</span>
          </Link>
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <div className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}