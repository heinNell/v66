import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActionItem } from '../types';
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

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

    return (
        <AppContext.Provider value={{ actionItems, addActionItem, updateActionItem, deleteActionItem, connectionStatus }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};