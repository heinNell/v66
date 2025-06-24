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
