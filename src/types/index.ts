// Role Types
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

// User Types
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  createdById?: string | null;
  createdBy?: User | null;
  createdAdmins?: User[];
  clubs?: Club[];
  clubIds?: string[];
  createdAt: string;
  updatedAt: string;
}

// Club Types
export interface Club {
  id: string;
  name: string;
  location: string;
  contactNumber: string;
  adminId: string;
  admin?: User;
  address: string;
  phone: string;
  email: string;
  adminIds?: string[];
  members?: Member[];
  visitors?: Visitor[];
  trials?: Trial[];
  payments?: Payment[];
  expenses?: Expense[];
  inventory?: InventoryItem[];
  attendance?: Attendance[];
  subscriptionPlans?: SubscriptionPlan[];
  createdAt: string;
  updatedAt: string;
}

// Visitor Types
export enum VisitorType {
  VISITOR = 'VISITOR',
  TRIAL = 'TRIAL',
  MEMBER = 'MEMBER',
}

export enum MemberStatus {
  VISITOR = 'VISITOR',
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface BaseVisitor {
  id: string;
  name: string;
  mobile: string;
  address: string;
  referralSource: string;
  visitDate: string;
  type: VisitorType;
  clubId: string;
  club?: Club;
  createdAt: string;
  updatedAt: string;
}

export interface Visitor extends BaseVisitor {
  type: VisitorType.VISITOR;
}

export interface Trial extends BaseVisitor {
  type: VisitorType.TRIAL;
  fee: number;
  trialStartDate: string;
  trialEndDate: string;
  payment?: Payment;
  convertedToMember: boolean;
}

export interface Member extends BaseVisitor {
  type: VisitorType.MEMBER;
  memberId: string;
  membershipStartDate: string;
  membershipEndDate: string;
  subscriptionPlanId: string;
  subscriptionPlan?: SubscriptionPlan;
  payments?: Payment[];
  attendance?: Attendance[];
  isActive: boolean;
  phone: string;
  email: string;
  address: string;
  status: MemberStatus;
  joinDate?: string;
  clubId: string;
}

// Financial Types
export interface Payment {
  id: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: 'FULL' | 'PARTIAL';
  pendingAmount: number;
  clubId: string;
  club?: Club;
  memberId?: string;
  member?: Member;
  trialId?: string;
  trial?: Trial;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  clubId: string;
  club?: Club;
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: 'EQUIPMENT' | 'SUPPLIES' | 'UNIFORMS' | 'SAFETY' | 'OTHER';
  quantity: number;
  minThreshold: number;
  unit: string;
  unitPrice: number;
  clubId: string;
  club?: Club;
  usageRecords?: InventoryUsage[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryUsage {
  id: string;
  date: string;
  quantity: number;
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  memberId?: string;
  member?: Member;
  clubId: string;
  club?: Club;
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export interface Attendance {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
  memberId: string;
  member?: Member;
  clubId: string;
  club?: Club;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  price: number;
  features: string[];
  clubId: string;
  club?: Club;
  members?: Member[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface DashboardMetrics {
  dailyVisitors: number;
  trialConversions: number;
  newMemberships: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  stockLevels: Record<string, number>;
  attendanceRate: number;
  memberGrowth: number[];
  revenueAnalytics: number[];
  visitorTrends: number[];
}

// Authentication Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}
