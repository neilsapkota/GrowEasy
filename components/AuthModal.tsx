import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { XIcon } from './icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (credentialResponse: CredentialResponse) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSignIn }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl text-center max-w-sm w-full transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-2">Join GrowEasy</h2>
        <p className="text-slate-400 mb-6">Create an account to save your progress and start learning!</p>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={onSignIn}
            onError={() => {
              console.error('Login Failed');
            }}
            theme="filled_blue"
            size="large"
            shape="rectangular"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;