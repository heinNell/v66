import React, { FC } from 'react';
import {
  Bell,
  Search,
  Settings,
  User as UserRound,
  Plus,
  Menu
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onNewTrip: () => void;
  title?: string;
  userName?: string;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onToggleSidebar?: () => void;
}

const Header: FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onNewTrip,
  title = "Transport Management System",
  userName = "Current User",
  onProfileClick,
  onNotificationsClick,
  onSettingsClick,
  onToggleSidebar
}) => {
  const { connectionStatus } = useAppContext();
  
  // Get current page title
  const navItems = [
    { id: 'ytd-kpis', label: 'YTD KPIs' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'active-trips', label: 'Active Trips' },
    { id: 'completed-trips', label: 'Completed Trips' },
    { id: 'flags', label: 'Flags & Investigations' },
    { id: 'reports', label: 'Reports & Exports' },
    { id: 'system-costs', label: 'Indirect Costs' },
    { id: 'invoice-aging', label: 'Invoice Aging' },
    { id: 'customer-retention', label: 'Customer Retention' },
    { id: 'missed-loads', label: 'Missed Loads' },
    { id: 'diesel-dashboard', label: 'Diesel Dashboard' },
    { id: 'driver-behavior', label: 'Driver Behavior' },
    { id: 'action-log', label: 'Action Log' }
  ];
  
  const currentPage = navItems.find(item => item.id === currentView)?.label || 'Dashboard';
  
  return (
    <header className="header">
      <div className="flex items-center">
        <button 
          className="md:hidden mr-4 text-gray-500 hover:text-gray-700"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <h1 className="text-xl font-semibold text-gray-900">
          {currentPage}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative max-w-xs hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* New Trip Button - Only show on relevant pages */}
          {(currentView === 'active-trips' || currentView === 'dashboard') && (
            <Button
              onClick={onNewTrip}
              icon={<Plus className="w-4 h-4" />}
            >
              New Trip
            </Button>
          )}
          
          {/* Notifications */}
          <button
            onClick={onNotificationsClick}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="sr-only">Notifications</span>
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="sr-only">Settings</span>
            <Settings className="h-5 w-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center">
            <button
              onClick={onProfileClick}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <UserRound className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium hidden md:block">{userName}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;