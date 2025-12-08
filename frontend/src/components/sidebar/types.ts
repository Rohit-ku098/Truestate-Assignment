export interface MenuItem {
    id: string;
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: SubMenuItem[];
}

export interface SubMenuItem {
    id: string;
    name: string;
    path: string;
    icon?: React.ReactNode;
}
