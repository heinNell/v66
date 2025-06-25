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

// Define types for other data structures
interface Trip {
    id: string;
    [key: string]: any;
}

interface MissedLoad {
    id: string;
    [key: string]: any;
}

interface DieselRecord {
    id: string;
    [key: string]: any;
}

interface DriverBehaviorEvent {
    id: string;
    [key: string]: any;
}

interface CARReport {
    id: string;
    [key: string]: any;
}

interface SystemCostRate {
    id: string;
    [key: string]: any;
}

interface AppContextType {
    // Action Items
    actionItems: ActionItem[];
    addActionItem: (data: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => string;
    updateActionItem: (item: ActionItem) => void;
    deleteActionItem: (id: string) => void;
    
    // Trips
    trips: Trip[];
    setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
    addTrip: (data: Omit<Trip, 'id'>) => string;
    updateTrip: (item: Trip) => void;
    deleteTrip: (id: string) => void;
    
    // Missed Loads
    missedLoads: MissedLoad[];
    setMissedLoads: React.Dispatch<React.SetStateAction<MissedLoad[]>>;
    addMissedLoad: (data: Omit<MissedLoad, 'id'>) => string;
    updateMissedLoad: (item: MissedLoad) => void;
    deleteMissedLoad: (id: string) => void;
    
    // Diesel Records
    dieselRecords: DieselRecord[];
    setDieselRecords: React.Dispatch<React.SetStateAction<DieselRecord[]>>;
    addDieselRecord: (data: Omit<DieselRecord, 'id'>) => string;
    updateDieselRecord: (item: DieselRecord) => void;
    deleteDieselRecord: (id: string) => void;
    
    // Driver Behavior Events
    driverBehaviorEvents: DriverBehaviorEvent[];
    setDriverBehaviorEvents: React.Dispatch<React.SetStateAction<DriverBehaviorEvent[]>>;
    addDriverBehaviorEvent: (data: Omit<DriverBehaviorEvent, 'id'>) => string;
    updateDriverBehaviorEvent: (item: DriverBehaviorEvent) => void;
    deleteDriverBehaviorEvent: (id: string) => void;
    
    // CAR Reports
    carReports: CARReport[];
    setCARReports: React.Dispatch<React.SetStateAction<CARReport[]>>;
    addCARReport: (data: Omit<CARReport, 'id'>) => string;
    updateCARReport: (item: CARReport) => void;
    deleteCARReport: (id: string) => void;
    
    // System Cost Rates
    systemCostRates: SystemCostRate[];
    setSystemCostRates: React.Dispatch<React.SetStateAction<SystemCostRate[]>>;
    addSystemCostRate: (data: Omit<SystemCostRate, 'id'>) => string;
    updateSystemCostRate: (item: SystemCostRate) => void;
    deleteSystemCostRate: (id: string) => void;
    
    connectionStatus: ConnectionStatus;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [actionItems, setActionItems] = useState<ActionItem[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [missedLoads, setMissedLoads] = useState<MissedLoad[]>([]);
    const [dieselRecords, setDieselRecords] = useState<DieselRecord[]>([]);
    const [driverBehaviorEvents, setDriverBehaviorEvents] = useState<DriverBehaviorEvent[]>([]);
    const [carReports, setCARReports] = useState<CARReport[]>([]);
    const [systemCostRates, setSystemCostRates] = useState<SystemCostRate[]>([]);
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

    // Action Items functions
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

    // Trips functions
    const addTrip = (data: Omit<Trip, 'id'>): string => {
        const id = uuidv4();
        const newTrip = { id, ...data };
        setTrips(prev => [...prev, newTrip]);
        return id;
    };

    const updateTrip = (item: Trip) => {
        setTrips(prev => prev.map(trip => trip.id === item.id ? item : trip));
    };

    const deleteTrip = (id: string) => {
        setTrips(prev => prev.filter(trip => trip.id !== id));
    };

    // Missed Loads functions
    const addMissedLoad = (data: Omit<MissedLoad, 'id'>): string => {
        const id = uuidv4();
        const newMissedLoad = { id, ...data };
        setMissedLoads(prev => [...prev, newMissedLoad]);
        return id;
    };

    const updateMissedLoad = (item: MissedLoad) => {
        setMissedLoads(prev => prev.map(load => load.id === item.id ? item : load));
    };

    const deleteMissedLoad = (id: string) => {
        setMissedLoads(prev => prev.filter(load => load.id !== id));
    };

    // Diesel Records functions
    const addDieselRecord = (data: Omit<DieselRecord, 'id'>): string => {
        const id = uuidv4();
        const newRecord = { id, ...data };
        setDieselRecords(prev => [...prev, newRecord]);
        return id;
    };

    const updateDieselRecord = (item: DieselRecord) => {
        setDieselRecords(prev => prev.map(record => record.id === item.id ? item : record));
    };

    const deleteDieselRecord = (id: string) => {
        setDieselRecords(prev => prev.filter(record => record.id !== id));
    };

    // Driver Behavior Events functions
    const addDriverBehaviorEvent = (data: Omit<DriverBehaviorEvent, 'id'>): string => {
        const id = uuidv4();
        const newEvent = { id, ...data };
        setDriverBehaviorEvents(prev => [...prev, newEvent]);
        return id;
    };

    const updateDriverBehaviorEvent = (item: DriverBehaviorEvent) => {
        setDriverBehaviorEvents(prev => prev.map(event => event.id === item.id ? item : event));
    };

    const deleteDriverBehaviorEvent = (id: string) => {
        setDriverBehaviorEvents(prev => prev.filter(event => event.id !== id));
    };

    // CAR Reports functions
    const addCARReport = (data: Omit<CARReport, 'id'>): string => {
        const id = uuidv4();
        const newReport = { id, ...data };
        setCARReports(prev => [...prev, newReport]);
        return id;
    };

    const updateCARReport = (item: CARReport) => {
        setCARReports(prev => prev.map(report => report.id === item.id ? item : report));
    };

    const deleteCARReport = (id: string) => {
        setCARReports(prev => prev.filter(report => report.id !== id));
    };

    // System Cost Rates functions
    const addSystemCostRate = (data: Omit<SystemCostRate, 'id'>): string => {
        const id = uuidv4();
        const newRate = { id, ...data };
        setSystemCostRates(prev => [...prev, newRate]);
        return id;
    };

    const updateSystemCostRate = (item: SystemCostRate) => {
        setSystemCostRates(prev => prev.map(rate => rate.id === item.id ? item : rate));
    };

    const deleteSystemCostRate = (id: string) => {
        setSystemCostRates(prev => prev.filter(rate => rate.id !== id));
    };

    const contextValue: AppContextType = {
        // Action Items
        actionItems,
        addActionItem,
        updateActionItem,
        deleteActionItem,
        
        // Trips
        trips,
        setTrips,
        addTrip,
        updateTrip,
        deleteTrip,
        
        // Missed Loads
        missedLoads,
        setMissedLoads,
        addMissedLoad,
        updateMissedLoad,
        deleteMissedLoad,
        
        // Diesel Records
        dieselRecords,
        setDieselRecords,
        addDieselRecord,
        updateDieselRecord,
        deleteDieselRecord,
        
        // Driver Behavior Events
        driverBehaviorEvents,
        setDriverBehaviorEvents,
        addDriverBehaviorEvent,
        updateDriverBehaviorEvent,
        deleteDriverBehaviorEvent,
        
        // CAR Reports
        carReports,
        setCARReports,
        addCARReport,
        updateCARReport,
        deleteCARReport,
        
        // System Cost Rates
        systemCostRates,
        setSystemCostRates,
        addSystemCostRate,
        updateSystemCostRate,
        deleteSystemCostRate,
        
        connectionStatus
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};