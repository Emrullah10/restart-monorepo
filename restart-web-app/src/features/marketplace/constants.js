import { Smartphone, Laptop, Tablet, Headphones, LayoutGrid } from 'lucide-react';

export const MARKETPLACE_CATEGORIES = [
  { id: 'all', label: 'Tümü', icon: LayoutGrid, color: '#64748B' },
  { id: 'phone', label: 'Telefon', icon: Smartphone, color: '#3B82F6' },
  { id: 'laptop', label: 'Laptop', icon: Laptop, color: '#A855F7' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, color: '#10B981' },
  { id: 'accessory', label: 'Aksesuar', icon: Headphones, color: '#F59E0B' }
];
