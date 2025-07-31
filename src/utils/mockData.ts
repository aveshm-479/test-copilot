import { 
  User, 
  UserRole, 
  Club, 
  Member, 
  Trial, 
  Visitor, 
  Payment, 
  Expense, 
  InventoryItem, 
  InventoryUsage, 
  Attendance, 
  SubscriptionPlan,
  VisitorType,
  MemberStatus,
  DashboardMetrics
} from '../types';

// Generate dates
const generateDate = (daysAgo = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Mock Users
const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'superadmin',
    name: 'Super Admin',
    email: 'superadmin@magicalcommunity.com',
    phone: '+1-555-0100',
    role: UserRole.SUPER_ADMIN,
    createdById: null,
    createdAt: generateDate(100),
    updatedAt: generateDate(50),
    createdAdmins: []
  },
  {
    id: 'user-2',
    username: 'admin1',
    name: 'Admin One',
    email: 'admin1@magicalcommunity.com',
    phone: '+1-555-0101',
    role: UserRole.ADMIN,
    createdById: 'user-1',
    createdAt: generateDate(90),
    updatedAt: generateDate(45),
    createdAdmins: []
  },
  {
    id: 'user-3',
    username: 'admin2',
    name: 'Admin Two',
    email: 'admin2@magicalcommunity.com',
    phone: '+1-555-0102',
    role: UserRole.ADMIN,
    createdById: 'user-2',
    createdAt: generateDate(80),
    updatedAt: generateDate(40),
    createdAdmins: []
  }
];

// Set up admin hierarchy relationships
mockUsers[0].createdAdmins = [mockUsers[1]];
mockUsers[1].createdAdmins = [mockUsers[2]];
mockUsers[1].createdBy = mockUsers[0];
mockUsers[2].createdBy = mockUsers[1];

// Mock Clubs
const mockClubs: Club[] = [
  {
    id: 'club-1',
    name: 'Magical Wellness Central',
    location: 'Downtown',
    address: '123 Central Avenue, Downtown City, State 12345',
    contactNumber: '+91 9876543210',
    phone: '+91 9876543210',
    email: 'central@magicalwellness.com',
    adminId: 'user-2',
    createdAt: generateDate(85),
    updatedAt: generateDate(42)
  },
  {
    id: 'club-2',
    name: 'Magical Fitness East',
    location: 'East City',
    address: '456 East Street, East City, State 12346',
    contactNumber: '+91 9876543211',
    phone: '+91 9876543211',
    email: 'east@magicalfitness.com',
    adminId: 'user-3',
    createdAt: generateDate(75),
    updatedAt: generateDate(38)
  },
  {
    id: 'club-3',
    name: 'Magical Health North',
    location: 'North City',
    address: '789 North Road, North City, State 12347',
    contactNumber: '+91 9876543212',
    phone: '+91 9876543212',
    email: 'north@magicalhealth.com',
    adminId: 'user-2',
    createdAt: generateDate(65),
    updatedAt: generateDate(32)
  }
];

// Set up club relationships
mockUsers[1].clubs = [mockClubs[0], mockClubs[2]];
mockUsers[2].clubs = [mockClubs[1]];
mockClubs[0].admin = mockUsers[1];
mockClubs[1].admin = mockUsers[2];
mockClubs[2].admin = mockUsers[1];

// Mock Subscription Plans
const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan-1',
    name: 'Basic Monthly',
    description: 'Basic membership with standard amenities',
    duration: 30, // 30 days
    price: 7500,
    features: ['Access to gym', 'Basic training', 'Locker access'],
    clubId: 'club-1',
    isActive: true,
    createdAt: generateDate(85),
    updatedAt: generateDate(42)
  },
  {
    id: 'plan-2',
    name: 'Premium Monthly',
    description: 'Premium membership with all amenities',
    duration: 30, // 30 days
    price: 10000,
    features: ['Access to gym', 'Premium training', 'Locker access', 'Nutrition counseling', 'Spa access'],
    clubId: 'club-1',
    isActive: true,
    createdAt: generateDate(84),
    updatedAt: generateDate(41)
  },
  {
    id: 'plan-3',
    name: 'Basic Monthly',
    description: 'Basic membership with standard amenities',
    duration: 30, // 30 days
    price: 7000,
    features: ['Access to gym', 'Basic training', 'Locker access'],
    clubId: 'club-2',
    isActive: true,
    createdAt: generateDate(83),
    updatedAt: generateDate(40)
  }
];

// Set up subscription plan relationships
mockClubs[0].subscriptionPlans = [mockSubscriptionPlans[0], mockSubscriptionPlans[1]];
mockClubs[1].subscriptionPlans = [mockSubscriptionPlans[2]];
mockSubscriptionPlans[0].club = mockClubs[0];
mockSubscriptionPlans[1].club = mockClubs[0];
mockSubscriptionPlans[2].club = mockClubs[1];

// Mock Members
const mockMembers: Member[] = [
  {
    id: 'member-1',
    name: 'Rahul Sharma',
    mobile: '+91 9876543220',
    phone: '+91 9876543220',
    email: 'rahul@example.com',
    address: '123 Main St, Downtown',
    referralSource: 'Google',
    visitDate: generateDate(70),
    type: VisitorType.MEMBER,
    clubId: 'club-1',
    memberId: 'M001',
    membershipStartDate: generateDate(65),
    membershipEndDate: generateDate(-25), // Future date
    subscriptionPlanId: 'plan-1',
    isActive: true,
    status: MemberStatus.ACTIVE,
    createdAt: generateDate(70),
    updatedAt: generateDate(65)
  },
  {
    id: 'member-2',
    name: 'Priya Patel',
    mobile: '+91 9876543221',
    phone: '+91 9876543221',
    email: 'priya@example.com',
    address: '456 Park Ave, East City',
    referralSource: 'Friend',
    visitDate: generateDate(60),
    type: VisitorType.MEMBER,
    clubId: 'club-2',
    memberId: 'M002',
    membershipStartDate: generateDate(58),
    membershipEndDate: generateDate(-32), // Future date
    subscriptionPlanId: 'plan-3',
    isActive: true,
    status: MemberStatus.ACTIVE,
    createdAt: generateDate(60),
    updatedAt: generateDate(58)
  }
];

// Mock Trials
const mockTrials: Trial[] = [
  {
    id: 'trial-1',
    name: 'Vikram Singh',
    mobile: '+91 9876543222',
    address: '789 Lake Rd, North City',
    referralSource: 'Instagram',
    visitDate: generateDate(10),
    type: VisitorType.TRIAL,
    clubId: 'club-1',
    fee: 700,
    trialStartDate: generateDate(10),
    trialEndDate: generateDate(7),
    convertedToMember: false,
    createdAt: generateDate(10),
    updatedAt: generateDate(10)
  },
  {
    id: 'trial-2',
    name: 'Anita Desai',
    mobile: '+91 9876543223',
    address: '234 Hill St, Downtown',
    referralSource: 'Facebook',
    visitDate: generateDate(15),
    type: VisitorType.TRIAL,
    clubId: 'club-2',
    fee: 700,
    trialStartDate: generateDate(15),
    trialEndDate: generateDate(12),
    convertedToMember: true,
    createdAt: generateDate(15),
    updatedAt: generateDate(12)
  }
];

// Mock Visitors
const mockVisitors: Visitor[] = [
  {
    id: 'visitor-1',
    name: 'Suresh Kumar',
    mobile: '+91 9876543224',
    address: '567 River Rd, East City',
    referralSource: 'Walk-in',
    visitDate: generateDate(5),
    type: VisitorType.VISITOR,
    clubId: 'club-1',
    createdAt: generateDate(5),
    updatedAt: generateDate(5)
  },
  {
    id: 'visitor-2',
    name: 'Meera Joshi',
    mobile: '+91 9876543225',
    address: '890 Mountain Ave, North City',
    referralSource: 'Flyer',
    visitDate: generateDate(3),
    type: VisitorType.VISITOR,
    clubId: 'club-3',
    createdAt: generateDate(3),
    updatedAt: generateDate(3)
  }
];

// Mock Payments
const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    amount: 7500,
    date: generateDate(65),
    paymentMethod: 'Credit Card',
    status: 'FULL',
    pendingAmount: 0,
    clubId: 'club-1',
    memberId: 'member-1',
    createdAt: generateDate(65),
    updatedAt: generateDate(65)
  },
  {
    id: 'payment-2',
    amount: 5000,
    date: generateDate(58),
    paymentMethod: 'Cash',
    status: 'PARTIAL',
    pendingAmount: 2000,
    clubId: 'club-2',
    memberId: 'member-2',
    createdAt: generateDate(58),
    updatedAt: generateDate(58)
  },
  {
    id: 'payment-3',
    amount: 700,
    date: generateDate(10),
    paymentMethod: 'UPI',
    status: 'FULL',
    pendingAmount: 0,
    clubId: 'club-1',
    trialId: 'trial-1',
    createdAt: generateDate(10),
    updatedAt: generateDate(10)
  }
];

// Mock Expenses
const mockExpenses: Expense[] = [
  {
    id: 'expense-1',
    description: 'Equipment maintenance',
    amount: 5000,
    date: generateDate(30),
    category: 'Maintenance',
    clubId: 'club-1',
    createdAt: generateDate(30),
    updatedAt: generateDate(30)
  },
  {
    id: 'expense-2',
    description: 'Utility bills',
    amount: 8000,
    date: generateDate(20),
    category: 'Utilities',
    clubId: 'club-2',
    createdAt: generateDate(20),
    updatedAt: generateDate(20)
  }
];

// Mock Inventory Items
const mockInventoryItems: InventoryItem[] = [
  {
    id: 'inventory-1',
    name: 'Protein Shake',
    category: 'SUPPLIES',
    quantity: 50,
    minThreshold: 10,
    unit: 'bottles',
    unitPrice: 150,
    clubId: 'club-1',
    createdAt: generateDate(90),
    updatedAt: generateDate(15)
  },
  {
    id: 'inventory-2',
    name: 'Multivitamin',
    category: 'SUPPLIES',
    quantity: 100,
    minThreshold: 20,
    unit: 'bottles',
    unitPrice: 200,
    clubId: 'club-2',
    createdAt: generateDate(85),
    updatedAt: generateDate(10)
  },
  {
    id: 'inventory-3',
    name: 'BCAA Supplement',
    category: 'SUPPLIES',
    quantity: 30,
    minThreshold: 5,
    unit: 'containers',
    unitPrice: 350,
    clubId: 'club-1',
    createdAt: generateDate(80),
    updatedAt: generateDate(5)
  }
];

// Mock Inventory Usage
const mockInventoryUsage: InventoryUsage[] = [
  {
    id: 'usage-1',
    date: generateDate(15),
    quantity: 2,
    inventoryItemId: 'inventory-1',
    memberId: 'member-1',
    clubId: 'club-1',
    createdAt: generateDate(15),
    updatedAt: generateDate(15)
  },
  {
    id: 'usage-2',
    date: generateDate(10),
    quantity: 1,
    inventoryItemId: 'inventory-2',
    memberId: 'member-2',
    clubId: 'club-2',
    createdAt: generateDate(10),
    updatedAt: generateDate(10)
  }
];

// Mock Attendance
const mockAttendance: Attendance[] = [
  {
    id: 'attendance-1',
    date: generateDate(5),
    status: 'PRESENT',
    memberId: 'member-1',
    clubId: 'club-1',
    createdAt: generateDate(5),
    updatedAt: generateDate(5)
  },
  {
    id: 'attendance-2',
    date: generateDate(4),
    status: 'PRESENT',
    memberId: 'member-2',
    clubId: 'club-2',
    createdAt: generateDate(4),
    updatedAt: generateDate(4)
  },
  {
    id: 'attendance-3',
    date: generateDate(3),
    status: 'ABSENT',
    memberId: 'member-1',
    clubId: 'club-1',
    createdAt: generateDate(3),
    updatedAt: generateDate(3)
  }
];

// Set up relationships
mockMembers[0].subscriptionPlan = mockSubscriptionPlans[0];
mockMembers[1].subscriptionPlan = mockSubscriptionPlans[2];
mockMembers[0].club = mockClubs[0];
mockMembers[1].club = mockClubs[1];
mockTrials[0].club = mockClubs[0];
mockTrials[1].club = mockClubs[1];
mockVisitors[0].club = mockClubs[0];
mockVisitors[1].club = mockClubs[2];

mockClubs[0].members = [mockMembers[0]];
mockClubs[1].members = [mockMembers[1]];
mockClubs[0].trials = [mockTrials[0]];
mockClubs[1].trials = [mockTrials[1]];
mockClubs[0].visitors = [mockVisitors[0]];
mockClubs[2].visitors = [mockVisitors[1]];

mockMembers[0].payments = [mockPayments[0]];
mockMembers[1].payments = [mockPayments[1]];
mockTrials[0].payment = mockPayments[2];

mockPayments[0].member = mockMembers[0];
mockPayments[1].member = mockMembers[1];
mockPayments[2].trial = mockTrials[0];

mockInventoryUsage[0].inventoryItem = mockInventoryItems[0];
mockInventoryUsage[1].inventoryItem = mockInventoryItems[1];
mockInventoryUsage[0].member = mockMembers[0];
mockInventoryUsage[1].member = mockMembers[1];

mockAttendance[0].member = mockMembers[0];
mockAttendance[1].member = mockMembers[1];
mockAttendance[2].member = mockMembers[0];

mockMembers[0].attendance = [mockAttendance[0], mockAttendance[2]];
mockMembers[1].attendance = [mockAttendance[1]];

// Mock Dashboard Metrics
const mockDashboardMetrics: DashboardMetrics = {
  dailyVisitors: 5,
  trialConversions: 2,
  newMemberships: 1,
  dailyRevenue: 8900,
  monthlyRevenue: 165000,
  stockLevels: {
    'Protein Shake': 50,
    'Multivitamin': 100,
    'BCAA Supplement': 30
  },
  attendanceRate: 0.75,
  memberGrowth: [10, 12, 15, 18, 20, 23, 25],
  revenueAnalytics: [120000, 140000, 135000, 150000, 165000, 155000, 165000],
  visitorTrends: [20, 25, 18, 30, 28, 35, 32]
};

// Helper function to get mock user by role
export const getMockUser = (role = UserRole.SUPER_ADMIN): User => {
  const user = role === UserRole.SUPER_ADMIN ? mockUsers[0] : mockUsers[1];
  return {...user};
};

// Export all mock data
export const mockData = {
  users: mockUsers,
  clubs: mockClubs,
  members: mockMembers,
  trials: mockTrials,
  visitors: mockVisitors,
  payments: mockPayments,
  expenses: mockExpenses,
  inventoryItems: mockInventoryItems,
  inventoryUsage: mockInventoryUsage,
  attendance: mockAttendance,
  subscriptionPlans: mockSubscriptionPlans,
  dashboardMetrics: mockDashboardMetrics
};
