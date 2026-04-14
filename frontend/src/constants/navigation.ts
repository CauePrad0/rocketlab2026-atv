import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, Search } from 'lucide-react';

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Catalogo',
    path: '/catalogo',
    icon: Search,
  },
];
