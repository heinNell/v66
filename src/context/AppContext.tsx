import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ActionItem } from '../types';

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
    addActionItemComment: (actionItemId: string, comment: string) => void;
    
    // Trips
    trips: Trip[];
    setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
    addTrip: (data: Omit<Trip, 'id'>) => string;
    updateTrip: (item: Trip) => void;
    deleteTrip: (id: string) => void;
    completeTrip: (id: string) => void;
    importTripsFromCSV: (tripsData: any[]) => Promise<void>;
    importTripsFromWebhook: () => Promise<{imported: number, skipped: number}>;
    
    // Cost Entries
    addCostEntry: (costData: any, files?: FileList) => void;
    updateCostEntry: (cost: any) => void;
    deleteCostEntry: (id: string) => void;
    
    // Additional Costs
    addAdditionalCost: (tripId: string, cost: any, files?: FileList) => void;
    removeAdditionalCost: (tripId: string, costId: string) => void;
    
    // Delay Reasons
    addDelayReason: (tripId: string, delay: any) => void;
    
    // Invoice Management
    updateInvoicePayment: (tripId: string, paymentData: any) => void;
    
    // Diesel Management
    allocateDieselToTrip: (dieselRecordId: string, tripId: string) => Promise<void>;
    removeDieselFromTrip: (dieselRecordId: string) => Promise<void>;
    
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
    addDriverBehaviorEvent: (data: Omit<DriverBehaviorEvent, 'id'>, files?: FileList) => string;
    updateDriverBehaviorEvent: (item: DriverBehaviorEvent) => void;
    deleteDriverBehaviorEvent: (id: string) => void;
    getAllDriversPerformance: () => any[];
    
    // CAR Reports
    carReports: CARReport[];
    setCARReports: React.Dispatch<React.SetStateAction<CARReport[]>>;
    addCARReport: (data: Omit<CARReport, 'id'>, files?: FileList) => string;
    updateCARReport: (item: CARReport, files?: FileList) => void;
    deleteCARReport: (id: string) => void;
    
    // System Cost Rates
    systemCostRates: any;
    updateSystemCostRates: (currency: 'USD' | 'ZAR', rates: any) => Promise<void>;
    
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
    const [systemCostRates, setSystemCostRates] = useState<any>({
        USD: {
            perKmCosts: {
                repairMaintenance: 0.15,
                tyreCost: 0.08
            },
            perDayCosts: {
                gitInsurance: 25,
                shortTermInsurance: 15,
                trackingCost: 5,
                fleetManagementSystem: 10,
                licensing: 8,
                vidRoadworthy: 7,
                wages: 50,
                depreciation: 30
            },
            lastUpdated: new Date().toISOString(),
            updatedBy: 'System',
            effectiveDate: new Date().toISOString(),
            currency: 'USD'
        },
        ZAR: {
            perKmCosts: {
                repairMaintenance: 2.5,
                tyreCost: 1.2
            },
            perDayCosts: {
                gitInsurance: 400,
                shortTermInsurance: 250,
                trackingCost: 80,
                fleetManagementSystem: 150,
                licensing: 120,
                vidRoadworthy: 100,
                wages: 800,
                depreciation: 500
            },
            lastUpdated: new Date().toISOString(),
            updatedBy: 'System',
            effectiveDate: new Date().toISOString(),
            currency: 'ZAR'
        }
    });
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');

    // Action Items functions
    const addActionItem = (data: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): string => {
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        const newItem = { id, ...data, createdAt: timestamp, updatedAt: timestamp, createdBy: 'Current User' };
        setActionItems(prev => [...prev, newItem]);
        return id;
    };

    const updateActionItem = (item: ActionItem) => {
        const timestamp = new Date().toISOString();
        const updatedItem = { ...item, updatedAt: timestamp };
        setActionItems(prev => prev.map(i => i.id === item.id ? updatedItem : i));
    };

    const deleteActionItem = (id: string) => {
        setActionItems(prev => prev.filter(item => item.id !== id));
    };

    const addActionItemComment = (actionItemId: string, comment: string) => {
        const item = actionItems.find(item => item.id === actionItemId);
        if (!item) return;
        
        const commentId = uuidv4();
        const newComment = {
            id: commentId,
            comment,
            createdBy: 'Current User',
            createdAt: new Date().toISOString()
        };
        
        const updatedItem = {
            ...item,
            comments: [...(item.comments || []), newComment],
            updatedAt: new Date().toISOString()
        };
        
        updateActionItem(updatedItem);
    };

    // Trips functions
    const addTrip = (data: Omit<Trip, 'id'>): string => {
        const id = uuidv4();
        const newTrip = { 
            id, 
            ...data,
            status: 'active',
            costs: [],
            additionalCosts: [],
            delayReasons: [],
            followUpHistory: []
        };
        setTrips(prev => [...prev, newTrip]);
        return id;
    };

    const updateTrip = (item: Trip) => {
        setTrips(prev => prev.map(trip => trip.id === item.id ? item : trip));
    };

    const deleteTrip = (id: string) => {
        setTrips(prev => prev.filter(trip => trip.id !== id));
    };

    const completeTrip = (id: string) => {
        setTrips(prev => prev.map(trip => {
            if (trip.id === id) {
                return {
                    ...trip,
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                    completedBy: 'Current User'
                };
            }
            return trip;
        }));
    };

    // Cost Entry functions
    const addCostEntry = (costData: any, files?: FileList) => {
        const costId = uuidv4();
        const timestamp = new Date().toISOString();
        
        // Process files if provided
        const attachments = files ? Array.from(files).map((file, index) => ({
            id: `A${Date.now()}-${index}`,
            costEntryId: costId,
            filename: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: timestamp
        })) : [];
        
        const newCost = {
            id: costId,
            ...costData,
            attachments,
            createdAt: timestamp,
            updatedAt: timestamp
        };
        
        // Find the trip and add the cost
        setTrips(prev => prev.map(trip => {
            if (trip.id === costData.tripId) {
                return {
                    ...trip,
                    costs: [...(trip.costs || []), newCost]
                };
            }
            return trip;
        }));
        
        return costId;
    };

    const updateCostEntry = (cost: any) => {
        // Find the trip that contains this cost
        setTrips(prev => prev.map(trip => {
            if (trip.costs && trip.costs.some(c => c.id === cost.id)) {
                return {
                    ...trip,
                    costs: trip.costs.map(c => c.id === cost.id ? cost : c)
                };
            }
            return trip;
        }));
    };

    const deleteCostEntry = (id: string) => {
        // Find the trip that contains this cost
        setTrips(prev => prev.map(trip => {
            if (trip.costs && trip.costs.some(c => c.id === id)) {
                return {
                    ...trip,
                    costs: trip.costs.filter(c => c.id !== id)
                };
            }
            return trip;
        }));
    };

    // Additional Cost functions
    const addAdditionalCost = (tripId: string, cost: any, files?: FileList) => {
        const costId = uuidv4();
        const timestamp = new Date().toISOString();
        
        // Process files if provided
        const supportingDocuments = files ? Array.from(files).map((file, index) => ({
            id: `D${Date.now()}-${index}`,
            costId: costId,
            filename: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: timestamp
        })) : [];
        
        const newCost = {
            id: costId,
            ...cost,
            supportingDocuments,
            addedAt: timestamp
        };
        
        // Find the trip and add the additional cost
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    additionalCosts: [...(trip.additionalCosts || []), newCost]
                };
            }
            return trip;
        }));
        
        return costId;
    };

    const removeAdditionalCost = (tripId: string, costId: string) => {
        // Find the trip and remove the additional cost
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    additionalCosts: (trip.additionalCosts || []).filter(c => c.id !== costId)
                };
            }
            return trip;
        }));
    };

    // Delay Reason functions
    const addDelayReason = (tripId: string, delay: any) => {
        const delayId = uuidv4();
        const newDelay = {
            id: delayId,
            ...delay
        };
        
        // Find the trip and add the delay reason
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    delayReasons: [...(trip.delayReasons || []), newDelay]
                };
            }
            return trip;
        }));
        
        return delayId;
    };

    // Invoice Management functions
    const updateInvoicePayment = (tripId: string, paymentData: any) => {
        // Find the trip and update payment info
        setTrips(prev => prev.map(trip => {
            if (trip.id === tripId) {
                const updatedTrip = { ...trip, ...paymentData };
                
                // If payment status is 'paid', update trip status
                if (paymentData.paymentStatus === 'paid') {
                    updatedTrip.status = 'paid';
                }
                
                return updatedTrip;
            }
            return trip;
        }));
    };

    // Diesel Management functions
    const allocateDieselToTrip = async (dieselRecordId: string, tripId: string): Promise<void> => {
        try {
            // Find the diesel record
            const dieselRecord = dieselRecords.find(r => r.id === dieselRecordId);
            if (!dieselRecord) throw new Error('Diesel record not found');
            
            // Find the trip
            const trip = trips.find(t => t.id === tripId);
            if (!trip) throw new Error('Trip not found');
            
            // Update the diesel record with the trip ID
            const updatedRecord = {
                ...dieselRecord,
                tripId,
                updatedAt: new Date().toISOString()
            };
            
            // Create a cost entry for the trip
            const costId = uuidv4();
            const newCost = {
                id: costId,
                tripId,
                category: 'Fuel Costs',
                subCategory: 'Diesel',
                amount: dieselRecord.totalCost,
                currency: dieselRecord.currency || 'ZAR',
                referenceNumber: `DIESEL-${dieselRecordId}`,
                date: dieselRecord.date,
                notes: `Diesel fill-up: ${dieselRecord.litresFilled} liters at ${dieselRecord.fuelStation}`,
                attachments: [],
                isFlagged: false,
                isSystemGenerated: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Update state
            setDieselRecords(prev => prev.map(r => r.id === dieselRecordId ? updatedRecord : r));
            setTrips(prev => prev.map(t => {
                if (t.id === tripId) {
                    return {
                        ...t,
                        costs: [...(t.costs || []), newCost]
                    };
                }
                return t;
            }));
            
            return Promise.resolve();
        } catch (error) {
            console.error('Error allocating diesel to trip:', error);
            return Promise.reject(error);
        }
    };

    const removeDieselFromTrip = async (dieselRecordId: string): Promise<void> => {
        try {
            // Find the diesel record
            const dieselRecord = dieselRecords.find(r => r.id === dieselRecordId);
            if (!dieselRecord) throw new Error('Diesel record not found');
            
            const tripId = dieselRecord.tripId;
            if (!tripId) throw new Error('Diesel record not linked to any trip');
            
            // Update the diesel record to remove the trip ID
            const updatedRecord = {
                ...dieselRecord,
                tripId: undefined,
                updatedAt: new Date().toISOString()
            };
            
            // Remove the cost entry from the trip
            setDieselRecords(prev => prev.map(r => r.id === dieselRecordId ? updatedRecord : r));
            setTrips(prev => prev.map(t => {
                if (t.id === tripId) {
                    return {
                        ...t,
                        costs: (t.costs || []).filter(c => c.referenceNumber !== `DIESEL-${dieselRecordId}`)
                    };
                }
                return t;
            }));
            
            return Promise.resolve();
        } catch (error) {
            console.error('Error removing diesel from trip:', error);
            return Promise.reject(error);
        }
    };

    // Import functions
    const importTripsFromCSV = async (tripsData: any[]): Promise<void> => {
        try {
            const newTrips = tripsData.map(data => ({
                id: uuidv4(),
                ...data,
                status: 'active',
                costs: [],
                additionalCosts: [],
                delayReasons: [],
                followUpHistory: []
            }));
            
            setTrips(prev => [...prev, ...newTrips]);
            return Promise.resolve();
        } catch (error) {
            console.error('Error importing trips from CSV:', error);
            return Promise.reject(error);
        }
    };

    const importTripsFromWebhook = async (): Promise<{imported: number, skipped: number}> => {
        try {
            // Simulate webhook import
            const result = {
                imported: 3,
                skipped: 1
            };
            
            // In a real implementation, this would fetch data from an API
            // For now, we'll just return a mock result
            return Promise.resolve(result);
        } catch (error) {
            console.error('Error importing trips from webhook:', error);
            return Promise.reject(error);
        }
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
    const addDriverBehaviorEvent = (data: Omit<DriverBehaviorEvent, 'id'>, files?: FileList): string => {
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        
        // Process files if provided
        const attachments = files ? Array.from(files).map((file, index) => ({
            id: `E${Date.now()}-${index}`,
            eventId: id,
            filename: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: timestamp
        })) : [];
        
        const newEvent = { 
            id, 
            ...data,
            attachments,
            reportedAt: timestamp
        };
        
        setDriverBehaviorEvents(prev => [...prev, newEvent]);
        return id;
    };

    const updateDriverBehaviorEvent = (item: DriverBehaviorEvent) => {
        setDriverBehaviorEvents(prev => prev.map(event => event.id === item.id ? item : event));
    };

    const deleteDriverBehaviorEvent = (id: string) => {
        setDriverBehaviorEvents(prev => prev.filter(event => event.id !== id));
    };

    const getAllDriversPerformance = () => {
        // Calculate driver performance metrics
        const driversMap = new Map();
        
        // Process all driver behavior events
        driverBehaviorEvents.forEach(event => {
            if (!driversMap.has(event.driverName)) {
                driversMap.set(event.driverName, {
                    driverName: event.driverName,
                    totalEvents: 0,
                    totalPoints: 0,
                    criticalEvents: 0,
                    highEvents: 0,
                    mediumEvents: 0,
                    lowEvents: 0,
                    resolvedEvents: 0,
                    behaviorScore: 100 // Start with perfect score
                });
            }
            
            const driverStats = driversMap.get(event.driverName);
            driverStats.totalEvents++;
            driverStats.totalPoints += event.points || 0;
            
            // Count by severity
            if (event.severity === 'critical') driverStats.criticalEvents++;
            else if (event.severity === 'high') driverStats.highEvents++;
            else if (event.severity === 'medium') driverStats.mediumEvents++;
            else if (event.severity === 'low') driverStats.lowEvents++;
            
            // Count resolved events
            if (event.status === 'resolved') driverStats.resolvedEvents++;
            
            // Update behavior score (simple algorithm)
            // Critical: -15, High: -10, Medium: -5, Low: -2
            const deduction = 
                (driverStats.criticalEvents * 15) + 
                (driverStats.highEvents * 10) + 
                (driverStats.mediumEvents * 5) + 
                (driverStats.lowEvents * 2);
            
            driverStats.behaviorScore = Math.max(0, 100 - deduction);
            
            driversMap.set(event.driverName, driverStats);
        });
        
        return Array.from(driversMap.values());
    };

    // CAR Reports functions
    const addCARReport = (data: Omit<CARReport, 'id'>, files?: FileList): string => {
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        
        // Process files if provided
        const attachments = files ? Array.from(files).map((file, index) => ({
            id: `C${Date.now()}-${index}`,
            reportId: id,
            filename: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: timestamp
        })) : [];
        
        const newReport = { 
            id, 
            ...data,
            attachments,
            createdAt: timestamp,
            updatedAt: timestamp
        };
        
        setCARReports(prev => [...prev, newReport]);
        
        // If this report is linked to a driver behavior event, update that event
        if (data.referenceEventId) {
            setDriverBehaviorEvents(prev => prev.map(event => {
                if (event.id === data.referenceEventId) {
                    return {
                        ...event,
                        carReportId: id,
                        updatedAt: timestamp
                    };
                }
                return event;
            }));
        }
        
        return id;
    };

    const updateCARReport = (item: CARReport, files?: FileList) => {
        const timestamp = new Date().toISOString();
        
        // Process new files if provided
        let updatedReport = { ...item, updatedAt: timestamp };
        
        if (files && files.length > 0) {
            const newAttachments = Array.from(files).map((file, index) => ({
                id: `C${Date.now()}-${index}`,
                reportId: item.id,
                filename: file.name,
                fileUrl: URL.createObjectURL(file),
                fileType: file.type,
                fileSize: file.size,
                uploadedAt: timestamp
            }));
            
            updatedReport.attachments = [
                ...(updatedReport.attachments || []),
                ...newAttachments
            ];
        }
        
        setCARReports(prev => prev.map(report => report.id === item.id ? updatedReport : report));
    };

    const deleteCARReport = (id: string) => {
        // Find the report to check if it's linked to an event
        const report = carReports.find(r => r.id === id);
        
        // Remove the report
        setCARReports(prev => prev.filter(report => report.id !== id));
        
        // If the report was linked to an event, update that event
        if (report && report.referenceEventId) {
            setDriverBehaviorEvents(prev => prev.map(event => {
                if (event.id === report.referenceEventId) {
                    const { carReportId, ...rest } = event;
                    return {
                        ...rest,
                        updatedAt: new Date().toISOString()
                    };
                }
                return event;
            }));
        }
    };

    // System Cost Rates functions
    const updateSystemCostRates = async (currency: 'USD' | 'ZAR', rates: any): Promise<void> => {
        try {
            setSystemCostRates(prev => ({
                ...prev,
                [currency]: rates
            }));
            return Promise.resolve();
        } catch (error) {
            console.error('Error updating system cost rates:', error);
            return Promise.reject(error);
        }
    };

    const contextValue: AppContextType = {
        // Action Items
        actionItems,
        addActionItem,
        updateActionItem,
        deleteActionItem,
        addActionItemComment,
        
        // Trips
        trips,
        setTrips,
        addTrip,
        updateTrip,
        deleteTrip,
        completeTrip,
        importTripsFromCSV,
        importTripsFromWebhook,
        
        // Cost Entries
        addCostEntry,
        updateCostEntry,
        deleteCostEntry,
        
        // Additional Costs
        addAdditionalCost,
        removeAdditionalCost,
        
        // Delay Reasons
        addDelayReason,
        
        // Invoice Management
        updateInvoicePayment,
        
        // Diesel Management
        allocateDieselToTrip,
        removeDieselFromTrip,
        
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
        getAllDriversPerformance,
        
        // CAR Reports
        carReports,
        setCARReports,
        addCARReport,
        updateCARReport,
        deleteCARReport,
        
        // System Cost Rates
        systemCostRates,
        updateSystemCostRates,
        
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