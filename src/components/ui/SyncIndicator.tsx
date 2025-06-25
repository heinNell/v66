import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, Clock } from 'lucide-react';

interface SyncIndicatorProps {
  className?: string;
  showText?: boolean;
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({ 
  className = '',
  showText = true
}) => {
  // Force connection status to always be "connected"
  const connectionStatus = "connected";
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  
  // Simulate sync activity periodically
  useEffect(() => {
    const simulateSync = () => {
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setLastSynced(new Date());
      }, 1500);
    };
    
    // Initial sync
    simulateSync();
    
    // Set up interval for periodic syncs
    const interval = setInterval(simulateSync, 60000); // Sync every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Format time since last sync
  const getTimeSinceSync = () => {
    if (!lastSynced) return 'Just now';
    
    const seconds = Math.floor((new Date().getTime() - lastSynced.getTime()) / 1000);
    
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  return (
    <div className={`flex items-center space-x-2 text-xs ${className}`}>
      {isSyncing ? (
        <>
          <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
          {showText && <span className="text-blue-600">Syncing data...</span>}
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {showText && (
            <span className="text-gray-500">
              Synced {getTimeSinceSync()}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default SyncIndicator;