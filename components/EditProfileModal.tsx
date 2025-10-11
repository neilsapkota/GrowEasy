

import React, { useState, useRef } from 'react';
import { User } from '../types';
import { WritingIcon } from './icons';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onUpdateUser: (updatedUser: Partial<User>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');
    const [feedback, setFeedback] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateUser({ name: name.trim(), bio: bio.trim() });
        setFeedback('Profile saved!');
        setTimeout(() => {
            setFeedback('');
            onClose();
        }, 1500);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 96;
                    const MAX_HEIGHT = 96;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Compress to 80% quality JPEG
                    onUpdateUser({ avatarUrl: dataUrl });
                };
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
                        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 p-2 bg-teal-600 rounded-full text-white hover:bg-teal-700 transition-colors"
                            aria-label="Change profile picture"
                        >
                            <WritingIcon className="w-5 h-5" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            hidden
                            accept="image/*"
                        />
                    </div>
                    <form onSubmit={handleProfileSave} className="flex-grow w-full">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name-edit" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Your Name</label>
                                <input
                                    id="name-edit"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 text-lg bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="bio-edit" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Your Bio</label>
                                <textarea
                                    id="bio-edit"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Write a short caption..."
                                    rows={3}
                                    maxLength={150}
                                    className="w-full px-4 py-2 text-lg bg-slate-100 dark:bg-slate-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                />
                            </div>
                        </div>
                    </form>
                </div>
                {feedback && <p className="text-sm text-green-600 mt-4 text-center">{feedback}</p>}
                <div className="flex justify-end gap-3 mt-6">
                     <button onClick={onClose} className="px-6 py-2 font-bold rounded-lg bg-slate-200 dark:bg-slate-600 hover:bg-slate-300">Cancel</button>
                     <button onClick={handleProfileSave} className="px-6 py-2 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;