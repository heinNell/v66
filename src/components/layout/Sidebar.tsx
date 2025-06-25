import React from 'react';
import { 
  Activity, 
  BarChart3, 
  CheckCircle, 
  ClipboardList, 
  Clock, 
  Flag, 
  Fuel, 
  Settings, 
  Shield, 
  Target, 
  TrendingDown, 
  Truck, 
  Users 
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { connectionStatus } = useAppContext();
  
  const navItems = [
    { id: 'ytd-kpis', label: 'YTD KPIs', icon: Target },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'active-trips', label: 'Active Trips', icon: Truck },
    { id: 'completed-trips', label: 'Completed Trips', icon: CheckCircle },
    { id: 'flags', label: 'Flags & Investigations', icon: Flag },
    { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
    { id: 'system-costs', label: 'Indirect Costs', icon: Settings },
    { id: 'invoice-aging', label: 'Invoice Aging', icon: Clock },
    { id: 'customer-retention', label: 'Customer Retention', icon: Users },
    { id: 'missed-loads', label: 'Missed Loads', icon: TrendingDown },
    { id: 'diesel-dashboard', label: 'Diesel Dashboard', icon: Fuel },
    { id: 'driver-behavior', label: 'Driver Behavior', icon: Shield },
    { id: 'action-log', label: 'Action Log', icon: ClipboardList }
  ];

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-white shadow-md z-10 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Matanuska Transport</h1>
        <p className="text-sm text-gray-500 mt-1">Fleet Management System</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-4 mb-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Navigation
          </h2>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'reconnecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="ml-2 text-xs text-gray-500">
              {connectionStatus === 'connected' ? 'Online' : 
               connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Offline'}
            </span>
          </div>
          <div className="text-xs text-gray-500">v1.0.0</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;