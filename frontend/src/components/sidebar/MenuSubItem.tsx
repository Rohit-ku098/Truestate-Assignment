import React from 'react';
import type { SubMenuItem } from './types';

interface MenuSubItemProps {
    subItem: SubMenuItem;
    isActive: boolean;
    onClick: () => void;
}

const MenuSubItem: React.FC<MenuSubItemProps> = ({ subItem, isActive, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm cursor-pointer transition-colors rounded-lg ${isActive
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
        >
            {subItem.icon ? (
                <span className="shrink-0">{subItem.icon}</span>
            ) : (
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-purple-500' : 'border border-gray-500'
                    }`}></div>
            )}
            <span>{subItem.name}</span>
        </div>
    );
};

export default MenuSubItem;
