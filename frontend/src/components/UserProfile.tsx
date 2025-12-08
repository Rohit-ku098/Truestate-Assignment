import React from 'react';
import { ChevronDown } from 'lucide-react';

interface UserProfileProps {
    name: string;
    subtitle: string;
    avatarLetter: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, subtitle, avatarLetter }) => {
    return (
        <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3 border border-gray-300 cursor-pointer  bg-white rounded-lg p-2 transition-colors">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {avatarLetter}
                </div>
                <div className="flex-1">
                    <div className="font-bold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-700">{subtitle}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-700" />
            </div>
        </div>
    );
};

export default UserProfile;
