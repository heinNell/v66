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

// Driver Behavior Event Types
export const DRIVER_BEHAVIOR_EVENT_TYPES = [
    { label: 'Speeding', value: 'speeding', points: 10, severity: 'High' },
    { label: 'Harsh Braking', value: 'harsh_braking', points: 8, severity: 'Medium' },
    { label: 'Harsh Acceleration', value: 'harsh_acceleration', points: 6, severity: 'Medium' },
    { label: 'Sharp Cornering', value: 'sharp_cornering', points: 5, severity: 'Low' },
    { label: 'Idling', value: 'idling', points: 3, severity: 'Low' },
    { label: 'Unauthorized Stop', value: 'unauthorized_stop', points: 7, severity: 'Medium' },
    { label: 'Route Deviation', value: 'route_deviation', points: 9, severity: 'High' },
    { label: 'Fatigue Detection', value: 'fatigue_detection', points: 12, severity: 'High' },
    { label: 'Mobile Phone Usage', value: 'mobile_usage', points: 15, severity: 'High' },
    { label: 'Seatbelt Violation', value: 'seatbelt_violation', points: 8, severity: 'Medium' }
];

// Cost Categories and Sub-Categories
export const COST_CATEGORIES: Record<string, string[]> = {
    'Fuel Costs': [
        'Diesel',
        'Petrol',
        'AdBlue',
        'Fuel Cards',
        'Emergency Fuel'
    ],
    'Maintenance Costs': [
        'Scheduled Service',
        'Repairs',
        'Tyres',
        'Oil Change',
        'Brake Service',
        'Engine Repair',
        'Transmission Repair',
        'Emergency Repairs'
    ],
    'Driver Costs': [
        'Salaries',
        'Overtime',
        'Allowances',
        'Accommodation',
        'Meals',
        'Medical',
        'Training'
    ],
    'Route Costs': [
        'Tolls',
        'Permits',
        'Border Fees',
        'Parking',
        'Weighbridge Fees'
    ],
    'Insurance Costs': [
        'Vehicle Insurance',
        'Cargo Insurance',
        'Third Party Insurance',
        'Comprehensive Cover'
    ],
    'Administrative Costs': [
        'Documentation',
        'Communication',
        'Office Supplies',
        'Legal Fees',
        'Banking Fees'
    ],
    'Non-Value-Added Costs': [
        'Delays',
        'Detention',
        'Demurrage',
        'Penalties',
        'Fines',
        'Waiting Time',
        'Rework'
    ],
    'Border Costs': [
        'Customs Fees',
        'Documentation Fees',
        'Agent Fees',
        'Storage Fees',
        'Inspection Fees',
        'Transit Fees'
    ],
    'System Costs': [
        'Calculated Fuel',
        'Calculated Maintenance',
        'Calculated Insurance',
        'Calculated Driver Cost'
    ]
};

// Cost Entry interface
export interface CostEntry {
    id: string;
    tripId: string;
    category: string;
    subCategory: string;
    amount: number;
    currency: 'USD' | 'ZAR';
    referenceNumber: string;
    date: string;
    notes?: string;
    attachments: { id: string; filename: string; fileUrl: string }[];
    isFlagged: boolean;
    flagReason?: string;
    noDocumentReason?: string;
    investigationStatus?: 'pending' | 'in_progress' | 'resolved';
    flaggedAt?: string;
    flaggedBy?: string;
    isSystemGenerated: boolean;
    createdAt: string;
    updatedAt: string;
}

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
  status?: 'active' | 'completed' | 'invoiced' | 'paid';
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceDueDate?: string;
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  lastFollowUpDate?: string;
  followUpHistory?: FollowUpRecord[];
}

// Follow-up record interface
export interface FollowUpRecord {
  id: string;
  tripId: string;
  followUpDate: string;
  contactMethod: 'call' | 'email' | 'whatsapp' | 'in_person' | 'sms';
  responsibleStaff: string;
  responseSummary: string;
  nextFollowUpDate?: string;
  status: 'pending' | 'completed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  outcome: 'no_response' | 'promised_payment' | 'dispute' | 'payment_received' | 'partial_payment';
}

// Invoice aging interface
export interface InvoiceAging {
  tripId: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  currency: 'USD' | 'ZAR';
  agingDays: number;
  status: 'current' | 'warning' | 'critical' | 'overdue';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  lastFollowUp?: string;
}

// Invoice aging thresholds interface
export interface InvoiceAgingThresholds {
  current: { min: number; max: number };
  warning: { min: number; max: number };
  critical: { min: number; max: number };
  overdue: { min: number };
}

// Aging thresholds by currency
export const AGING_THRESHOLDS: Record<'USD' | 'ZAR', InvoiceAgingThresholds> = {
  USD: {
    current: { min: 0, max: 10 },
    warning: { min: 11, max: 13 },
    critical: { min: 14, max: 14 },
    overdue: { min: 15 }
  },
  ZAR: {
    current: { min: 0, max: 20 },
    warning: { min: 21, max: 29 },
    critical: { min: 30, max: 30 },
    overdue: { min: 31 }
  }
};

// Follow-up thresholds by currency (days when follow-up is required)
export const FOLLOW_UP_THRESHOLDS: Record<'USD' | 'ZAR', number> = {
  USD: 14,
  ZAR: 30
};

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

// Define which fleets have probes
export const FLEETS_WITH_PROBES = ['22H', '23H', '24H', '26H', '28H', '31H', '30H'];

// Fuel stations list
export const FUEL_STATIONS: string[] = [
  'Shell',
  'BP',
  'Total',
  'Engen',
  'Sasol',
  'Caltex',
  'Other'
];

// System Cost Configuration interfaces and constants
export interface SystemCostRates {
  fuelCostPerLiter: number;
  maintenanceCostPerKm: number;
  driverCostPerDay: number;
  insuranceCostPerTrip: number;
  tollCostPerKm: number;
}

export interface SystemCostReminder {
  enabled: boolean;
  reminderDays: number;
  reminderMessage: string;
}

export const DEFAULT_SYSTEM_COST_RATES: SystemCostRates = {
  fuelCostPerLiter: 1.5,
  maintenanceCostPerKm: 0.25,
  driverCostPerDay: 150,
  insuranceCostPerTrip: 50,
  tollCostPerKm: 0.1
};

export const DEFAULT_SYSTEM_COST_REMINDER: SystemCostReminder = {
  enabled: true,
  reminderDays: 7,
  reminderMessage: 'Please review and update system cost rates'
};

// Additional cost types
export const ADDITIONAL_COST_TYPES: string[] = [
  'Fuel',
  'Maintenance',
  'Tolls',
  'Parking',
  'Accommodation',
  'Meals',
  'Insurance',
  'Permits',
  'Other'
];

// Trip edit reasons
export const TRIP_EDIT_REASONS: string[] = [
  'Incorrect route information',
  'Wrong distance calculation',
  'Client information update',
  'Driver change',
  'Date correction',
  'Revenue adjustment',
  'Cost update',
  'Other'
];

// Trip deletion reasons
export const TRIP_DELETION_REASONS: string[] = [
  'Duplicate entry',
  'Cancelled trip',
  'Data entry error',
  'Client cancellation',
  'Vehicle breakdown',
  'Driver unavailability',
  'Route change',
  'Other'
];

// Missed load reasons
export const MISSED_LOAD_REASONS: string[] = [
  'Vehicle breakdown',
  'Driver unavailability',
  'Client cancellation',
  'Weather conditions',
  'Route restrictions',
  'Permit issues',
  'Fuel shortage',
  'Maintenance required',
  'Traffic delays',
  'Load not ready',
  'Documentation issues',
  'Other'
];