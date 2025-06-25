import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActionItem, SystemCostRates, DEFAULT_SYSTEM_COST_RATES } from '../types';
import {
    listenToActionItems,
    actionItemsCollection,
    addActionItemToFirebase,
    updateActionItemInFirebase,
    deleteActionItemFromFirebase
} from '../firebase';

// Connection status type
type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

interface AppContextType {
    actionItems: ActionItem[];
    addActionItem: (data: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => string;
    updateActionItem: (item: ActionItem) => void;
    deleteActionItem: (id: string) => void;
    connectionStatus: ConnectionStatus;
    // System Cost Management
    systemCostRates: Record<'USD' | 'ZAR', SystemCostRates>;
    updateSystemCostRates: (currency: 'USD' | 'ZAR', rates: SystemCostRates) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
    const [systemCostRates, setSystemCostRates] = useState<Record<'USD' | 'ZAR', SystemCostRates>>(DEFAULT_SYSTEM_COST_RATES);

    useEffect(() => {
        // Listen to Firestore actionItems collection
        const unsubscribe = listenToActionItems(
            actionItemsCollection,
            (items: ActionItem[]) => {
                setActionItems(items);
                setConnectionStatus('connected');
            },
            (error: Error) => {
                console.error('ActionItems listener error:', error);
                setConnectionStatus('disconnected');
            }
        );

        // Load system cost rates from localStorage
        const savedRates = localStorage.getItem('systemCostRates');
        if (savedRates) {
            try {
                const parsedRates = JSON.parse(savedRates);
                if (parsedRates.USD && parsedRates.ZAR) {
                    setSystemCostRates(parsedRates);
                }
            } catch (error) {
                console.error('Error parsing saved system cost rates:', error);
            }
        }

        return unsubscribe;
    }, []);

    const addActionItem = (data: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): string => {
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        addActionItemToFirebase({ id, ...data, createdAt: timestamp, updatedAt: timestamp, createdBy: 'Current User' });
        return id;
    };

    const updateActionItem = (item: ActionItem) => {
        const timestamp = new Date().toISOString();
        updateActionItemInFirebase(item.id, { ...item, updatedAt: timestamp, updatedBy: 'Current User' });
    };

    const deleteActionItem = (id: string) => {
        deleteActionItemFromFirebase(id);
    };

    const updateSystemCostRates = async (currency: 'USD' | 'ZAR', rates: SystemCostRates) => {
        try {
            // Update local state
            setSystemCostRates(prev => ({ ...prev, [currency]: rates }));

            // Save to localStorage for persistence
            const updatedRates = { ...systemCostRates, [currency]: rates };
            localStorage.setItem('systemCostRates', JSON.stringify(updatedRates));

            // TODO: In production, save to Firestore collection 'systemCostRates'
            // await saveSystemCostRatesToFirebase(currency, rates);
        } catch (error) {
            console.error('Error updating system cost rates:', error);
            throw error;
        }
    };

    return (
        <AppContext.Provider value={{ actionItems, addActionItem, updateActionItem, deleteActionItem, connectionStatus, systemCostRates, updateSystemCostRates }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};