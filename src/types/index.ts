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

export const CLIENTS: string[] = ['Client A', 'Client B', 'Client C'];
export const DRIVERS: string[] = ['Driver 1', 'Driver 2', 'Driver 3'];
export const CLIENT_TYPES: { label: string; value: 'internal' | 'external' }[] = [
  { label: 'Internal', value: 'internal' },
  { label: 'External', value: 'external' }
];
export const FLEET_NUMBERS: string[] = ['Fleet 01', 'Fleet 02', 'Fleet 03'];
