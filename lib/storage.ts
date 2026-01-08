import { MenuItem } from './types';

const STORAGE_KEY = 'portal_menu_items';
const API_URL = '/api/menu-items';

// Default menu items for demo
const DEFAULT_ITEMS: MenuItem[] = [
  {
    id: 'demo-copilot',
    name: 'Support Assistant',
    icon: 'MessageSquare',
    type: 'copilot',
    config: {
      embedUrl: 'https://copilotstudio.microsoft.com/environments/Default-xxxx',
    },
    order: 0,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@admin.com',
  },
  {
    id: 'demo-powerbi',
    name: 'Sales Dashboard',
    icon: 'BarChart3',
    type: 'powerbi',
    config: {
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      tenantId: 'your-tenant-id',
      workspaceId: 'your-workspace-id',
      reportId: 'your-report-id',
    },
    order: 1,
    createdAt: new Date().toISOString(),
    createdBy: 'admin@admin.com',
  },
];

// Server-side: return default items
export function getMenuItems(): MenuItem[] {
  if (typeof window === 'undefined') return DEFAULT_ITEMS;
  
  // Fallback to localStorage if API fails (for offline support)
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore localStorage errors
  }
  
  return DEFAULT_ITEMS;
}

// Client-side: fetch from API
export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (typeof window === 'undefined') return DEFAULT_ITEMS;
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch menu items');
    }
    const data = await response.json();
    const items = data.items || [];
    
    // Cache in localStorage as fallback
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore localStorage errors
    }
    
    return items;
  } catch (error) {
    console.error('Error fetching menu items from API:', error);
    // Fallback to localStorage
    return getMenuItems();
  }
}

// Save menu items to server
export async function saveMenuItems(items: MenuItem[]): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save menu items');
    }
    
    // Update localStorage cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore localStorage errors
    }
    
    return true;
  } catch (error) {
    console.error('Error saving menu items to API:', error);
    // Fallback to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch {
      return false;
    }
  }
}

export async function addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt'>): Promise<MenuItem> {
  const items = await fetchMenuItems();
  const newItem: MenuItem = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  await saveMenuItems(items);
  return newItem;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
  const items = await fetchMenuItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  
  items[index] = { ...items[index], ...updates };
  await saveMenuItems(items);
  return items[index];
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const items = await fetchMenuItems();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  
  await saveMenuItems(filtered);
  return true;
}

export async function reorderMenuItems(orderedIds: string[]): Promise<void> {
  const items = await fetchMenuItems();
  const reordered = orderedIds
    .map((id, index) => {
      const item = items.find((i) => i.id === id);
      if (item) return { ...item, order: index };
      return null;
    })
    .filter(Boolean) as MenuItem[];
  
  await saveMenuItems(reordered);
}
