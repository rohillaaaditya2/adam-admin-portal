export type Row = Record<string, any>;

export interface AdminKpis {
  totalRegistered: number;
  activeProfiles: number;
  paidSubscribers: number;
  pendingApproval: number;
  sources: {
    website: number;
    android: number;
    ios: number;
    excelImport: number;
    manualAdmin: number;
  };
  totalRevenueINR?: number;
  onlineRevenueINR?: number;
  offlineRevenueINR?: number;
}

export interface ModuleGroup {
  category: string;
  modules: string[];
}

export interface PhotoStat {
  total: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface ChatStat {
  totalConversations: number;
  cleanCount: number;
  phoneCount: number;
  flaggedCount: number;
  totalMessages: number;
}

export interface BackupStatus {
  success: boolean;
  filename: string;
  timestamp: string | Date;
  sizeMB: number;
  collectionsBackedUp: string[];
  status: string;
}
