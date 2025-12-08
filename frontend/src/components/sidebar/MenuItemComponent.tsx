import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { MenuItem } from './types';
import MenuSubItem from './MenuSubItem';

interface MenuItemComponentProps {
    item: MenuItem;
    isActive: boolean;
    activeSubItem: string | null;
    onItemClick: () => void;
    onSubItemClick: (subItemId: string) => void;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
    item,
    isActive,
    activeSubItem,
    onItemClick,
    onSubItemClick,
}) => {
    const [isExpanded, setIsExpanded] = useState(isActive);

    const handleItemClick = () => {
        if (item.subItems && item.subItems.length > 0) {
            setIsExpanded(!isExpanded);
        }
        onItemClick();
    };

    return (
        <div className={`${isActive ? 'bg-white rounded-lg' : ''}`}>
            {/* Main Menu Item */}
            <div
                onClick={handleItemClick}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${isActive
                    ? 'bg-white text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
            >
                <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                </div>
                {item.subItems && item.subItems.length > 0 && (
                    <div className="transition-transform duration-200">
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </div>
                )}
            </div>

            {/* Sub Items */}
            {item.subItems && item.subItems.length > 0 && isExpanded && (
                <div className="ml-8 p-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {item.subItems.map((subItem) => (
                        <MenuSubItem
                            key={subItem.id}
                            subItem={subItem}
                            isActive={activeSubItem === subItem.id}
                            onClick={() => onSubItemClick(subItem.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuItemComponent;
