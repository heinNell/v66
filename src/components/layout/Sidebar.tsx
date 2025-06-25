import React, { useState } from 'react';
import { 
  Activity, 
  BarChart3, 
  CheckCircle, 
  ChevronDown,
  ChevronRight,
  ClipboardList, 
  Clock, 
  Flag, 
  Fuel, 
  Settings, 
  Shield, 
  Target, 
  TrendingDown, 
  Truck, 
  Users,
  LogOut
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface NavGroup {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { connectionStatus } = useAppContext();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'analytics': true,
    'operations': true,
    'finance': true,
    'management': true
  });
  
  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  const navGroups: NavGroup[] = [
    {
      title: 'Analytics',
      items: [
        { id: 'ytd-kpis', label: 'YTD KPIs', icon: Target },
        { id: 'dashboard', label: 'Dashboard', icon: Activity }
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'active-trips', label: 'Active Trips', icon: Truck },
        { id: 'completed-trips', label: 'Completed Trips', icon: CheckCircle },
        { id: 'flags', label: 'Flags & Investigations', icon: Flag },
        { id: 'diesel-dashboard', label: 'Diesel Management', icon: Fuel }
      ]
    },
    {
      title: 'Finance',
      items: [
        { id: 'invoice-aging', label: 'Invoice Aging', icon: Clock },
        { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
        { id: 'system-costs', label: 'Indirect Costs', icon: Settings }
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'customer-retention', label: 'Customer Retention', icon: Users },
        { id: 'missed-loads', label: 'Missed Loads', icon: TrendingDown },
        { id: 'driver-behavior', label: 'Driver Behavior', icon: Shield },
        { id: 'action-log', label: 'Action Log', icon: ClipboardList }
      ]
    }
  ];

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-gray-900 text-white shadow-lg z-10 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Matanuska Transport</h1>
        <p className="text-sm text-gray-400 mt-1">Fleet Management System</p>
      </div>
      
      <nav className="mt-6">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-4">
            <button 
              onClick={() => toggleGroup(group.title.toLowerCase())}
              className="w-full flex items-center justify-between px-6 py-2 text-sm font-semibold text-gray-400 hover:text-white"
            >
              <span>{group.title}</span>
              {expandedGroups[group.title.toLowerCase()] ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </button>
            
            {expandedGroups[group.title.toLowerCase()] && (
              <ul className="mt-1 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center px-8 py-3 text-sm font-medium transition-colors ${
                          currentView === item.id
                            ? 'text-white bg-blue-600 border-l-4 border-blue-400'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'reconnecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="ml-2 text-xs text-gray-400">
              {connectionStatus === 'connected' ? 'Online' : 
               connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Offline'}
            </span>
          </div>
          <button className="text-gray-400 hover:text-white">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;