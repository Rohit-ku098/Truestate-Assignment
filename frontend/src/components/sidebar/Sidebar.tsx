import React, { useState } from 'react';
import UserProfile from '../UserProfile';
import MenuItemComponent from './MenuItemComponent';
import type { MenuItem } from './types';
import ChartSquareIcon from '../../assets/chart-square.svg?react';
import ProfileIcon from '../../assets/profile-2user.svg?react';
import DocumentTextIcon from '../../assets/document-text.svg?react';
import DocumentSketchIcon from '../../assets/document-sketch.svg?react';
import PlayCircleIcon from '../../assets/play-circle.svg?react';
import TickCircleIcon from '../../assets/tick-circle.svg?react';
import CloseCircleIcon from '../../assets/close-circle.svg?react';
import CheckIcon from '../../assets/check.svg?react';
import { CirclePlay } from 'lucide-react';

const Sidebar: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string>('services');
    const [activeSubItem, setActiveSubItem] = useState<string | null>('pre-active');

    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: <ChartSquareIcon className="w-4 h-4" />,
            path: '/dashboard',
        },
        {
            id: 'nexus',
            name: 'Nexus',
            icon: <ProfileIcon className="w-4 h-4" />,
            path: '/nexus',
        },
        {
            id: 'intake',
            name: 'Intake',
            icon: <CirclePlay className="w-4 h-4" />,
            path: '/intake',
        },
        {
            id: 'services',
            name: 'Services',
            icon: <DocumentSketchIcon className="w-4 h-4" />,
            subItems: [
                {
                    id: 'pre-active',
                    name: 'Pre-active',
                    path: '/services/pre-active',
                    icon: <PlayCircleIcon className="w-3.5 h-3.5" />
                },
                {
                    id: 'active',
                    name: 'Active',
                    path: '/services/active',
                    icon: <CheckIcon className="w-3.5 h-3.5" />
                },
                {
                    id: 'blocked',
                    name: 'Blocked',
                    path: '/services/blocked',
                    icon: <CloseCircleIcon className="w-3.5 h-3.5" />
                },
                {
                    id: 'closed',
                    name: 'Closed',
                    path: '/services/closed',
                    icon: <TickCircleIcon className="w-3.5 h-3.5" />
                },
            ],
        },
        {
            id: 'invoices',
            name: 'Invoices',
            icon: <DocumentTextIcon className="w-4 h-4" />,
            subItems: [
                {
                    id: 'proforma',
                    name: 'Proforma Invoices',
                    path: '/invoices/proforma',
                    icon: <DocumentSketchIcon className="w-3.5 h-3.5" />
                },
                {
                    id: 'final',
                    name: 'Final Invoices',
                    path: '/invoices/final',
                    icon: <DocumentTextIcon className="w-3.5 h-3.5" />
                },
            ],
        },
    ];

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
        // If item has no sub-items, clear active sub-item
        const item = menuItems.find(i => i.id === itemId);
        if (!item?.subItems || item.subItems.length === 0) {
            setActiveSubItem(null);
        }
    };

    const handleSubItemClick = (subItemId: string) => {
        setActiveSubItem(subItemId);
    };

    return (
        <div className="w-64 bg-gray-200 text-black h-screen flex flex-col">
            {/* User Profile */}
            <UserProfile
                name="Vault"
                subtitle="Anurag Yadav"
                avatarLetter="V"
            />

            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <MenuItemComponent
                        key={item.id}
                        item={item}
                        isActive={activeItem === item.id}
                        activeSubItem={activeSubItem}
                        onItemClick={() => handleItemClick(item.id)}
                        onSubItemClick={handleSubItemClick}
                    />
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
