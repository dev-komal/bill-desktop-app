
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Home, Package, Receipt, Settings, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Receipt, label: 'Billing', path: '/billing' },
  { icon: BarChart3, label: 'Reports', path: '/reports', disabled: true },
  { icon: Settings, label: 'Settings', path: '/settings', disabled: true }
];

const Layout = () => {
  const location = useLocation();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-border h-screen">
          <div className="px-3 py-4">
            <div className="flex items-center px-3 py-2 mb-6">
              <ShoppingCart className="h-6 w-6 text-brand-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-brand-blue-800">HardwareBill</h1>
            </div>
            <SidebarContent>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      location.pathname === item.path
                        ? "bg-brand-blue-50 text-brand-blue-700"
                        : "text-gray-600 hover:bg-gray-100",
                      item.disabled && "opacity-50 pointer-events-none"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SidebarContent>
          </div>
        </Sidebar>
        
        <div className="flex-1 overflow-auto">
          <header className="border-b">
            <div className="flex h-16 items-center px-4 sm:px-6">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                {/* User profile placeholder */}
                <div className="relative h-8 w-8 rounded-full bg-brand-blue-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-brand-blue-700">A</span>
                </div>
              </div>
            </div>
          </header>
          
          <main className="p-4 sm:p-6 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
