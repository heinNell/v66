// ActionItem comment
export interface ActionItemComment {
  id: string;
  comment: string;
  createdBy: string;
  createdAt: string;
}

// ActionItem interface
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  responsiblePerson: string;
  startDate: string;
  dueDate: string;
  status: 'initiated' | 'in_progress' | 'completed';
  attachments?: { id: string; filename: string; fileUrl: string }[];
  comments?: ActionItemComment[];
  overdueReason?: string;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

// Example responsible persons list
export const RESPONSIBLE_PERSONS: string[] = ['Alice', 'Bob', 'Carol'];

// Trip type and related constants
export interface Trip {
  id: string;
  fleetNumber: string;
  clientName: string;
  driverName: string;
  route: string;
  startDate: string;
  endDate: string;
  distanceKm: number;
  baseRevenue: number;
  revenueCurrency: 'USD' | 'ZAR';
  clientType: 'internal' | 'external';
  tripDescription: string;
  tripNotes?: string;
  costs?: Cost[];
  shippedAt?: string;
}

// Cost interface for trip costs
export interface Cost {
  id: string;
  type: string;
  amount: number;
  currency: 'USD' | 'ZAR';
  description?: string;
  isFlagged?: boolean;
  investigationStatus?: 'pending' | 'in_progress' | 'resolved';
}

// Enhanced CostEntry interface for detailed cost tracking
export interface CostEntry {
  id: string;
  tripId: string;
  category: string;
  subCategory: string;
  amount: number;
  currency: 'USD' | 'ZAR';
  referenceNumber?: string;
  date: string;
  notes?: string;
  isFlagged?: boolean;
  isSystemGenerated?: boolean;
  systemCostType?: 'per-km' | 'per-day' | 'manual';
  calculationDetails?: string;
  attachments?: { id: string; filename: string; fileUrl: string }[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// System Cost Rate Configuration
export interface SystemCostRates {
  currency: 'USD' | 'ZAR';
  perKmCosts: {
    repairMaintenance: number;
    tyreCost: number;
  };
  perDayCosts: {
    gitInsurance: number;
    shortTermInsurance: number;
    trackingCost: number;
    fleetManagementSystem: number;
    licensing: number;
    vidRoadworthy: number;
    wages: number;
    depreciation: number;
  };
  lastUpdated: string;
  updatedBy: string;
  effectiveDate: string;
}

// System Cost Reminder Configuration
export interface SystemCostReminder {
  isActive: boolean;
  reminderFrequencyDays: number;
  lastReminderDate?: string;
  nextReminderDate: string;
  createdAt: string;
  updatedAt: string;
}

// Default System Cost Rates
export const DEFAULT_SYSTEM_COST_RATES: Record<'USD' | 'ZAR', SystemCostRates> = {
  USD: {
    currency: 'USD',
    perKmCosts: {
      repairMaintenance: 0.15,
      tyreCost: 0.08
    },
    perDayCosts: {
      gitInsurance: 12.00,
      shortTermInsurance: 8.50,
      trackingCost: 3.20,
      fleetManagementSystem: 5.75,
      licensing: 2.80,
      vidRoadworthy: 1.90,
      wages: 45.00,
      depreciation: 35.00
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: 'System Default',
    effectiveDate: new Date().toISOString()
  },
  ZAR: {
    currency: 'ZAR',
    perKmCosts: {
      repairMaintenance: 2.50,
      tyreCost: 1.35
    },
    perDayCosts: {
      gitInsurance: 200.00,
      shortTermInsurance: 142.00,
      trackingCost: 53.50,
      fleetManagementSystem: 96.00,
      licensing: 47.00,
      vidRoadworthy: 32.00,
      wages: 750.00,
      depreciation: 585.00
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: 'System Default',
    effectiveDate: new Date().toISOString()
  }
};

// Default System Cost Reminder
export const DEFAULT_SYSTEM_COST_REMINDER: SystemCostReminder = {
  isActive: true,
  reminderFrequencyDays: 30,
  nextReminderDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const CLIENTS: string[] = ['Client A', 'Client B', 'Client C'];
export const DRIVERS: string[] = ['Driver 1', 'Driver 2', 'Driver 3'];
export const CLIENT_TYPES: { label: string; value: 'internal' | 'external' }[] = [
  { label: 'Internal', value: 'internal' },
  { label: 'External', value: 'external' }
];
export const FLEET_NUMBERS: string[] = ['Fleet 01', 'Fleet 02', 'Fleet 03'];
