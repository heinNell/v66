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

// Delay Reason Types
export const DELAY_REASON_TYPES = [
    { label: 'Traffic congestion', value: 'traffic_congestion' },
    { label: 'Weather conditions', value: 'weather_conditions' },
    { label: 'Vehicle breakdown', value: 'vehicle_breakdown' },
    { label: 'Driver rest period', value: 'driver_rest_period' },
    { label: 'Border delays', value: 'border_delays' },
    { label: 'Customs clearance', value: 'customs_clearance' },
    { label: 'Loading/Unloading delays', value: 'loading_unloading_delays' },
    { label: 'Route restrictions', value: 'route_restrictions' },
    { label: 'Fuel shortage', value: 'fuel_shortage' },
    { label: 'Documentation issues', value: 'documentation_issues' },
    { label: 'Client delays', value: 'client_delays' },
    { label: 'Mechanical issues', value: 'mechanical_issues' },
    { label: 'Permit delays', value: 'permit_delays' },
    { label: 'Weighbridge queues', value: 'weighbridge_queues' },
    { label: 'Other', value: 'other' }
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
        'Repair & Maintenance per KM',
        'Tyre Cost per KM',
        'GIT Insurance',
        'Short-Term Insurance',
        'Tracking Cost',
        'Fleet Management System',
        'Licensing',
        'VID / Roadworthy',
        'Wages',
        'Depreciation'
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
    attachments: { id: string; filename: string; fileUrl: string; fileType?: string; fileSize?: number; uploadedAt?: string; }[];
    isFlagged: boolean;
    flagReason?: string;
    noDocumentReason?: string;
    investigationStatus?: 'pending' | 'in-progress' | 'resolved';
    investigationNotes?: string;
    flaggedAt?: string;
    flaggedBy?: string;
    resolvedAt?: string;
    resolvedBy?: string;
    isSystemGenerated: boolean;
    systemCostType?: 'per-km' | 'per-day';
    calculationDetails?: string;
    createdAt: string;
    updatedAt: string;
}

// Flagged Cost interface (extends CostEntry with trip info)
export interface FlaggedCost extends CostEntry {
    tripFleetNumber: string;
    tripRoute: string;
    tripDriverName?: string;
}

// Additional Cost interface
export interface AdditionalCost {
    id: string;
    tripId: string;
    costType: string;
    amount: number;
    currency: 'USD' | 'ZAR';
    notes?: string;
    supportingDocuments: { id: string; filename: string; fileUrl: string; }[];
    addedAt: string;
    addedBy: string;
}

// Additional Cost Types
export const ADDITIONAL_COST_TYPES = [
    { label: 'Demurrage', value: 'demurrage' },
    { label: 'Detention', value: 'detention' },
    { label: 'Storage Fees', value: 'storage_fees' },
    { label: 'Clearing Fees', value: 'clearing_fees' },
    { label: 'Customs Penalties', value: 'customs_penalties' },
    { label: 'Rework Costs', value: 'rework_costs' },
    { label: 'Cargo Damage', value: 'cargo_damage' },
    { label: 'Extra Loading/Unloading', value: 'extra_loading_unloading' },
    { label: 'Waiting Time', value: 'waiting_time' },
    { label: 'Diversion Costs', value: 'diversion_costs' },
    { label: 'Other', value: 'other' }
];

// Delay Reason interface
export interface DelayReason {
    id: string;
    tripId: string;
    delayType: string;
    description: string;
    delayDuration: number; // in hours
    reportedAt: string;
    reportedBy: string;
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    impactNotes?: string;
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
  distanceKm?: number;
  baseRevenue: number;
  revenueCurrency: 'USD' | 'ZAR';
  clientType: 'internal' | 'external';
  tripDescription?: string;
  tripNotes?: string;
  status?: 'active' | 'completed' | 'invoiced' | 'paid';
  costs: CostEntry[];
  additionalCosts?: AdditionalCost[];
  delayReasons?: DelayReason[];
  followUpHistory?: FollowUpRecord[];
  completedAt?: string;
  completedBy?: string;
  autoCompletedAt?: string;
  autoCompletedReason?: string;
  
  // Planning timeline
  plannedArrivalDateTime?: string;
  plannedOffloadDateTime?: string;
  plannedDepartureDateTime?: string;
  actualArrivalDateTime?: string;
  actualOffloadDateTime?: string;
  actualDepartureDateTime?: string;
  finalArrivalDateTime?: string;
  finalOffloadDateTime?: string;
  finalDepartureDateTime?: string;
  
  // Shipping status
  shippedAt?: string;
  shippedBy?: string;
  deliveredAt?: string;
  deliveredBy?: string;
  
  // Invoice details
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceDueDate?: string;
  invoiceSubmittedAt?: string;
  invoiceSubmittedBy?: string;
  invoiceValidationNotes?: string;
  timelineValidated?: boolean;
  timelineValidatedAt?: string;
  timelineValidatedBy?: string;
  proofOfDelivery?: { id: string; filename: string; fileUrl: string; }[];
  signedInvoice?: { id: string; filename: string; fileUrl: string; }[];
  
  // Payment tracking
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  paymentAmount?: number;
  paymentReceivedDate?: string;
  paymentMethod?: string;
  bankReference?: string;
  lastFollowUpDate?: string;
  
  // Edit history
  editHistory?: TripEditRecord[];
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

// Trip Edit Record
export interface TripEditRecord {
  id: string;
  tripId: string;
  editedBy: string;
  editedAt: string;
  reason: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  changeType: 'update' | 'delete' | 'restore';
}

// Trip Deletion Record
export interface TripDeletionRecord {
  id: string;
  tripId: string;
  deletedBy: string;
  deletedAt: string;
  reason: string;
  tripData: string; // JSON stringified trip data
  totalRevenue: number;
  totalCosts: number;
  costEntriesCount: number;
  flaggedItemsCount: number;
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

// Customer Performance interface
export interface CustomerPerformance {
  customerName: string;
  totalTrips: number;
  totalRevenue: number;
  currency: 'USD' | 'ZAR';
  averagePaymentDays: number;
  paymentScore: number;
  lastTripDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  isAtRisk: boolean;
  isProfitable: boolean;
  isTopClient: boolean;
}

// Missed Load interface
export interface MissedLoad {
  id: string;
  customerName: string;
  loadRequestDate: string;
  requestedPickupDate: string;
  requestedDeliveryDate: string;
  route: string;
  estimatedRevenue: number;
  currency: 'USD' | 'ZAR';
  reason: string;
  reasonDescription?: string;
  resolutionStatus: 'pending' | 'resolved' | 'lost_opportunity' | 'rescheduled';
  followUpRequired: boolean;
  competitorWon?: boolean;
  recordedBy: string;
  recordedAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  compensationOffered?: number;
  compensationNotes?: string;
  impact: 'low' | 'medium' | 'high';
}

// Diesel Consumption Record
export interface DieselConsumptionRecord {
  id: string;
  fleetNumber: string;
  date: string;
  kmReading: number;
  litresFilled: number;
  costPerLitre?: number;
  totalCost: number;
  fuelStation: string;
  driverName: string;
  notes?: string;
  previousKmReading?: number;
  distanceTravelled?: number;
  kmPerLitre?: number;
  currency?: 'USD' | 'ZAR';
  probeReading?: number;
  probeDiscrepancy?: number;
  probeVerified?: boolean;
  probeVerificationNotes?: string;
  probeVerifiedAt?: string;
  probeVerifiedBy?: string;
  tripId?: string;
  isReeferUnit?: boolean;
  linkedHorseId?: string;
  hoursOperated?: number;
  litresPerHour?: number;
  expectedLitresPerHour?: number;
  expectedKmPerLitre?: number;
  efficiencyVariance?: number;
  performanceStatus?: 'poor' | 'normal' | 'excellent';
  requiresDebrief?: boolean;
  toleranceRange?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Driver Behavior Event
export interface DriverBehaviorEvent {
  id: string;
  driverName: string;
  fleetNumber: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  description: string;
  location?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'acknowledged' | 'resolved' | 'disputed';
  actionTaken?: string;
  points: number;
  attachments?: { id: string; filename: string; fileUrl: string; }[];
  resolvedAt?: string;
  resolvedBy?: string;
  carReportId?: string;
  date: string; // For compatibility
}

export type DriverBehaviorEventType = 'speeding' | 'harsh_braking' | 'harsh_acceleration' | 
  'sharp_cornering' | 'idling' | 'unauthorized_stop' | 'route_deviation' | 
  'fatigue_detection' | 'mobile_usage' | 'seatbelt_violation';

// Corrective Action Report (CAR)
export interface CARReport {
  id: string;
  reportNumber: string;
  responsibleReporter: string;
  responsiblePerson: string;
  referenceEventId?: string;
  dateOfIncident: string;
  dateDue: string;
  clientReport: string;
  severity: 'high' | 'medium' | 'low';
  problemIdentification: string;
  causeAnalysisPeople?: string;
  causeAnalysisMaterials?: string;
  causeAnalysisEquipment?: string;
  causeAnalysisMethods?: string;
  causeAnalysisMetrics?: string;
  causeAnalysisEnvironment?: string;
  rootCauseAnalysis?: string;
  correctiveActions?: string;
  preventativeActionsImmediate?: string;
  preventativeActionsLongTerm?: string;
  financialImpact?: string;
  generalComments?: string;
  status: 'draft' | 'submitted' | 'in_progress' | 'completed';
  attachments?: { id: string; filename: string; fileUrl: string; }[];
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
  incidentDate?: string; // For compatibility
  description?: string; // For compatibility
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
  currency: 'USD' | 'ZAR';
}

export interface SystemCostReminder {
  isActive: boolean;
  reminderFrequencyDays: number;
  nextReminderDate: string;
  lastReminderDate?: string;
  updatedAt: string;
}

export const DEFAULT_SYSTEM_COST_RATES: Record<'USD' | 'ZAR', SystemCostRates> = {
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
};

export const DEFAULT_SYSTEM_COST_REMINDER: SystemCostReminder = {
  isActive: true,
  reminderFrequencyDays: 30,
  nextReminderDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString()
};

// Trip edit reasons
export const TRIP_EDIT_REASONS: string[] = [
  'Incorrect route information',
  'Wrong distance calculation',
  'Client information update',
  'Driver change',
  'Date correction',
  'Revenue adjustment',
  'Cost update',
  'Other (specify in comments)'
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
  'Other (specify in comments)'
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