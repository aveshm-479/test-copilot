import { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  Club, 
  User,
  Member, 
  Trial, 
  Visitor, 
  Payment, 
  Expense, 
  InventoryItem, 
  InventoryUsage, 
  Attendance, 
  SubscriptionPlan, 
  DashboardMetrics,
  UserRole,
  MemberStatus,
  VisitorType
} from '../types';
import { mockData } from '../utils/mockData';

// Define the application state
interface AppState {
  clubs: Club[];
  users: User[];
  members: Member[];
  trials: Trial[];
  visitors: Visitor[];
  payments: Payment[];
  expenses: Expense[];
  inventoryItems: InventoryItem[];
  inventoryUsage: InventoryUsage[];
  attendance: Attendance[];
  subscriptionPlans: SubscriptionPlan[];
  dashboardMetrics: DashboardMetrics | null;
  selectedClub: Club | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AppState = {
  clubs: [],
  users: [],
  members: [],
  trials: [],
  visitors: [],
  payments: [],
  expenses: [],
  inventoryItems: [],
  inventoryUsage: [],
  attendance: [],
  subscriptionPlans: [],
  dashboardMetrics: null,
  selectedClub: null,
  loading: true,
  error: null,
};

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_CLUBS'; payload: Club[] }
  | { type: 'ADD_CLUB'; payload: Club }
  | { type: 'UPDATE_CLUB'; payload: Club }
  | { type: 'DELETE_CLUB'; payload: string }
  | { type: 'SET_SELECTED_CLUB'; payload: Club | null }
  | { type: 'SET_MEMBERS'; payload: Member[] }
  | { type: 'ADD_MEMBER'; payload: Member }
  | { type: 'UPDATE_MEMBER'; payload: Member }
  | { type: 'DELETE_MEMBER'; payload: string }
  | { type: 'SET_TRIALS'; payload: Trial[] }
  | { type: 'ADD_TRIAL'; payload: Trial }
  | { type: 'UPDATE_TRIAL'; payload: Trial }
  | { type: 'DELETE_TRIAL'; payload: string }
  | { type: 'SET_VISITORS'; payload: Visitor[] }
  | { type: 'ADD_VISITOR'; payload: Visitor }
  | { type: 'UPDATE_VISITOR'; payload: Visitor }
  | { type: 'DELETE_VISITOR'; payload: string }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'DELETE_PAYMENT'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_INVENTORY_ITEMS'; payload: InventoryItem[] }
  | { type: 'ADD_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'UPDATE_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'DELETE_INVENTORY_ITEM'; payload: string }
  | { type: 'SET_INVENTORY_USAGE'; payload: InventoryUsage[] }
  | { type: 'ADD_INVENTORY_USAGE'; payload: InventoryUsage }
  | { type: 'UPDATE_INVENTORY_USAGE'; payload: InventoryUsage }
  | { type: 'DELETE_INVENTORY_USAGE'; payload: string }
  | { type: 'SET_ATTENDANCE'; payload: Attendance[] }
  | { type: 'ADD_ATTENDANCE'; payload: Attendance }
  | { type: 'UPDATE_ATTENDANCE'; payload: Attendance }
  | { type: 'DELETE_ATTENDANCE'; payload: string }
  | { type: 'SET_SUBSCRIPTION_PLANS'; payload: SubscriptionPlan[] }
  | { type: 'ADD_SUBSCRIPTION_PLAN'; payload: SubscriptionPlan }
  | { type: 'UPDATE_SUBSCRIPTION_PLAN'; payload: SubscriptionPlan }
  | { type: 'DELETE_SUBSCRIPTION_PLAN'; payload: string }
  | { type: 'SET_DASHBOARD_METRICS'; payload: DashboardMetrics };

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    case 'SET_CLUBS':
      return {
        ...state,
        clubs: action.payload,
      };
    case 'ADD_CLUB':
      return {
        ...state,
        clubs: [...state.clubs, action.payload],
      };
    case 'UPDATE_CLUB':
      return {
        ...state,
        clubs: state.clubs.map((club) =>
          club.id === action.payload.id ? action.payload : club
        ),
      };
    case 'DELETE_CLUB':
      return {
        ...state,
        clubs: state.clubs.filter((club) => club.id !== action.payload),
      };
    case 'SET_SELECTED_CLUB':
      return {
        ...state,
        selectedClub: action.payload,
      };
    case 'SET_MEMBERS':
      return {
        ...state,
        members: action.payload,
      };
    case 'ADD_MEMBER':
      return {
        ...state,
        members: [...state.members, action.payload],
      };
    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map((member) =>
          member.id === action.payload.id ? action.payload : member
        ),
      };
    case 'DELETE_MEMBER':
      return {
        ...state,
        members: state.members.filter((member) => member.id !== action.payload),
      };
    case 'SET_TRIALS':
      return {
        ...state,
        trials: action.payload,
      };
    case 'ADD_TRIAL':
      return {
        ...state,
        trials: [...state.trials, action.payload],
      };
    case 'UPDATE_TRIAL':
      return {
        ...state,
        trials: state.trials.map((trial) =>
          trial.id === action.payload.id ? action.payload : trial
        ),
      };
    case 'DELETE_TRIAL':
      return {
        ...state,
        trials: state.trials.filter((trial) => trial.id !== action.payload),
      };
    case 'SET_VISITORS':
      return {
        ...state,
        visitors: action.payload,
      };
    case 'ADD_VISITOR':
      return {
        ...state,
        visitors: [...state.visitors, action.payload],
      };
    case 'UPDATE_VISITOR':
      return {
        ...state,
        visitors: state.visitors.map((visitor) =>
          visitor.id === action.payload.id ? action.payload : visitor
        ),
      };
    case 'DELETE_VISITOR':
      return {
        ...state,
        visitors: state.visitors.filter((visitor) => visitor.id !== action.payload),
      };
    case 'SET_PAYMENTS':
      return {
        ...state,
        payments: action.payload,
      };
    case 'ADD_PAYMENT':
      return {
        ...state,
        payments: [...state.payments, action.payload],
      };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        ),
      };
    case 'DELETE_PAYMENT':
      return {
        ...state,
        payments: state.payments.filter((payment) => payment.id !== action.payload),
      };
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
      };
    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };
    case 'SET_INVENTORY_ITEMS':
      return {
        ...state,
        inventoryItems: action.payload,
      };
    case 'ADD_INVENTORY_ITEM':
      return {
        ...state,
        inventoryItems: [...state.inventoryItems, action.payload],
      };
    case 'UPDATE_INVENTORY_ITEM':
      return {
        ...state,
        inventoryItems: state.inventoryItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_INVENTORY_ITEM':
      return {
        ...state,
        inventoryItems: state.inventoryItems.filter((item) => item.id !== action.payload),
      };
    case 'SET_INVENTORY_USAGE':
      return {
        ...state,
        inventoryUsage: action.payload,
      };
    case 'ADD_INVENTORY_USAGE':
      return {
        ...state,
        inventoryUsage: [...state.inventoryUsage, action.payload],
      };
    case 'UPDATE_INVENTORY_USAGE':
      return {
        ...state,
        inventoryUsage: state.inventoryUsage.map((usage) =>
          usage.id === action.payload.id ? action.payload : usage
        ),
      };
    case 'DELETE_INVENTORY_USAGE':
      return {
        ...state,
        inventoryUsage: state.inventoryUsage.filter((usage) => usage.id !== action.payload),
      };
    case 'SET_ATTENDANCE':
      return {
        ...state,
        attendance: action.payload,
      };
    case 'ADD_ATTENDANCE':
      return {
        ...state,
        attendance: [...state.attendance, action.payload],
      };
    case 'UPDATE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.map((record) =>
          record.id === action.payload.id ? action.payload : record
        ),
      };
    case 'DELETE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.filter((record) => record.id !== action.payload),
      };
    case 'SET_SUBSCRIPTION_PLANS':
      return {
        ...state,
        subscriptionPlans: action.payload,
      };
    case 'ADD_SUBSCRIPTION_PLAN':
      return {
        ...state,
        subscriptionPlans: [...state.subscriptionPlans, action.payload],
      };
    case 'UPDATE_SUBSCRIPTION_PLAN':
      return {
        ...state,
        subscriptionPlans: state.subscriptionPlans.map((plan) =>
          plan.id === action.payload.id ? action.payload : plan
        ),
      };
    case 'DELETE_SUBSCRIPTION_PLAN':
      return {
        ...state,
        subscriptionPlans: state.subscriptionPlans.filter((plan) => plan.id !== action.payload),
      };
    case 'SET_DASHBOARD_METRICS':
      return {
        ...state,
        dashboardMetrics: action.payload,
      };
    default:
      return state;
  }
};

// Admin form data type
interface AdminFormData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  clubIds?: string[];
}

// Club form data type
interface ClubFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  adminIds?: string[];
}

// Member form data type
interface MemberFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  status: MemberStatus;
  joinDate?: string;
  clubId: string;
}

// Create app context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadClubs: () => Promise<void>;
  loadClubData: (clubId: string) => Promise<void>;
  setSelectedClub: (club: Club | null) => void;
  getFilteredMembers: (clubId: string) => Member[];
  getFilteredTrials: (clubId: string) => Trial[];
  getFilteredVisitors: (clubId: string) => Visitor[];
  getFilteredPayments: (clubId: string) => Payment[];
  getFilteredExpenses: (clubId: string) => Expense[];
  getFilteredInventory: (clubId: string) => InventoryItem[];
  getFilteredAttendance: (clubId: string) => Attendance[];
  getFilteredSubscriptionPlans: (clubId: string) => SubscriptionPlan[];
  
  // Admin management
  addAdmin: (adminData: AdminFormData) => void;
  updateAdmin: (adminId: string, adminData: AdminFormData) => void;
  deleteAdmin: (adminId: string) => void;
  
  // Club management
  addClub: (clubData: ClubFormData) => void;
  updateClub: (clubId: string, clubData: ClubFormData) => void;
  deleteClub: (clubId: string) => void;
  
  // Member management
  addMember: (memberData: MemberFormData) => void;
  updateMember: (memberId: string, memberData: MemberFormData) => void;
  deleteMember: (memberId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load clubs from API (mock data for now)
  const loadClubs = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'SET_CLUBS', payload: mockData.clubs });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load clubs' 
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load data for a specific club
  const loadClubData = async (clubId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter data for this club
      const members = mockData.members.filter(m => m.clubId === clubId);
      const trials = mockData.trials.filter(t => t.clubId === clubId);
      const visitors = mockData.visitors.filter(v => v.clubId === clubId);
      const payments = mockData.payments.filter(p => p.clubId === clubId);
      const expenses = mockData.expenses.filter(e => e.clubId === clubId);
      const inventoryItems = mockData.inventoryItems.filter(i => i.clubId === clubId);
      const inventoryUsage = mockData.inventoryUsage.filter(u => u.clubId === clubId);
      const attendance = mockData.attendance.filter(a => a.clubId === clubId);
      const subscriptionPlans = mockData.subscriptionPlans.filter(s => s.clubId === clubId);
      
      dispatch({ type: 'SET_MEMBERS', payload: members });
      dispatch({ type: 'SET_TRIALS', payload: trials });
      dispatch({ type: 'SET_VISITORS', payload: visitors });
      dispatch({ type: 'SET_PAYMENTS', payload: payments });
      dispatch({ type: 'SET_EXPENSES', payload: expenses });
      dispatch({ type: 'SET_INVENTORY_ITEMS', payload: inventoryItems });
      dispatch({ type: 'SET_INVENTORY_USAGE', payload: inventoryUsage });
      dispatch({ type: 'SET_ATTENDANCE', payload: attendance });
      dispatch({ type: 'SET_SUBSCRIPTION_PLANS', payload: subscriptionPlans });
      dispatch({ type: 'SET_DASHBOARD_METRICS', payload: mockData.dashboardMetrics });
      
      const selectedClub = mockData.clubs.find(c => c.id === clubId) || null;
      dispatch({ type: 'SET_SELECTED_CLUB', payload: selectedClub });
      
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load club data' 
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Set selected club
  const setSelectedClub = (club: Club | null) => {
    dispatch({ type: 'SET_SELECTED_CLUB', payload: club });
    if (club) {
      loadClubData(club.id);
    }
  };

  // Filter helpers
  const getFilteredMembers = (clubId: string) => {
    return state.members.filter(member => member.clubId === clubId);
  };

  const getFilteredTrials = (clubId: string) => {
    return state.trials.filter(trial => trial.clubId === clubId);
  };

  const getFilteredVisitors = (clubId: string) => {
    return state.visitors.filter(visitor => visitor.clubId === clubId);
  };

  const getFilteredPayments = (clubId: string) => {
    return state.payments.filter(payment => payment.clubId === clubId);
  };

  const getFilteredExpenses = (clubId: string) => {
    return state.expenses.filter(expense => expense.clubId === clubId);
  };

  const getFilteredInventory = (clubId: string) => {
    return state.inventoryItems.filter(item => item.clubId === clubId);
  };

  const getFilteredAttendance = (clubId: string) => {
    return state.attendance.filter(record => record.clubId === clubId);
  };

  const getFilteredSubscriptionPlans = (clubId: string) => {
    return state.subscriptionPlans.filter(plan => plan.clubId === clubId);
  };

  // Initial data loading
  useEffect(() => {
    loadClubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Admin management functions
  const addAdmin = (adminData: AdminFormData) => {
    // Generate a unique ID for the new admin
    const newAdmin = {
      ...adminData,
      id: `admin-${Date.now()}`,
      username: adminData.email, // Use email as username
      phone: adminData.phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real app, you'd make an API call here
    dispatch({ type: 'ADD_USER', payload: newAdmin });
  };
  
  const updateAdmin = (adminId: string, adminData: AdminFormData) => {
    // Find the existing user to preserve all fields
    const existingUser = state.users.find(user => user.id === adminId);
    if (!existingUser) return;
    
    // In a real app, you'd make an API call here
    dispatch({ 
      type: 'UPDATE_USER', 
      payload: {
        ...existingUser,
        ...adminData,
        id: adminId,
        username: adminData.email, // Use email as username
        updatedAt: new Date().toISOString()
      } 
    });
  };
  
  const deleteAdmin = (adminId: string) => {
    // In a real app, you'd make an API call here
    dispatch({ type: 'DELETE_USER', payload: adminId });
  };
  
  // Club management functions
  const addClub = (clubData: ClubFormData) => {
    // Generate a unique ID for the new club
    const newClub = {
      ...clubData,
      id: `club-${Date.now()}`,
      location: clubData.address,
      contactNumber: clubData.phone,
      adminId: clubData.adminIds?.[0] || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real app, you'd make an API call here
    dispatch({ type: 'ADD_CLUB', payload: newClub });
  };
  
  const updateClub = (clubId: string, clubData: ClubFormData) => {
    // Find the existing club to preserve all fields
    const existingClub = state.clubs.find(club => club.id === clubId);
    if (!existingClub) return;
    
    // In a real app, you'd make an API call here
    dispatch({ 
      type: 'UPDATE_CLUB', 
      payload: {
        ...existingClub,
        ...clubData,
        id: clubId,
        location: clubData.address,
        contactNumber: clubData.phone,
        adminId: clubData.adminIds?.[0] || existingClub.adminId,
        updatedAt: new Date().toISOString()
      } 
    });
  };
  
  const deleteClub = (clubId: string) => {
    // In a real app, you'd make an API call here
    dispatch({ type: 'DELETE_CLUB', payload: clubId });
  };
  
  // Member management functions
  const addMember = (memberData: MemberFormData) => {
    // Generate a unique ID for the new member
    const newMember: Member = {
      ...memberData,
      id: `member-${Date.now()}`,
      type: VisitorType.MEMBER,
      memberId: `MEM-${Date.now()}`,
      mobile: memberData.phone, // BaseVisitor requires mobile field
      referralSource: 'Direct',  // Default value
      visitDate: new Date().toISOString().split('T')[0], // BaseVisitor requirement
      membershipStartDate: memberData.joinDate || new Date().toISOString().split('T')[0],
      membershipEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      subscriptionPlanId: 'default-plan',
      isActive: memberData.status === MemberStatus.ACTIVE,
      joinDate: memberData.joinDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real app, you'd make an API call here
    dispatch({ type: 'ADD_MEMBER', payload: newMember });
  };
  
  const updateMember = (memberId: string, memberData: MemberFormData) => {
    // Find the existing member to preserve all fields
    const existingMember = state.members.find(member => member.id === memberId);
    if (!existingMember) return;
    
    // In a real app, you'd make an API call here
    dispatch({ 
      type: 'UPDATE_MEMBER', 
      payload: {
        ...existingMember,
        ...memberData,
        id: memberId,
        mobile: memberData.phone, // Update mobile field from phone
        isActive: memberData.status === MemberStatus.ACTIVE,
        updatedAt: new Date().toISOString()
      } 
    });
  };
  
  const deleteMember = (memberId: string) => {
    // In a real app, you'd make an API call here
    dispatch({ type: 'DELETE_MEMBER', payload: memberId });
  };

  const value = {
    state,
    dispatch,
    loadClubs,
    loadClubData,
    setSelectedClub,
    getFilteredMembers,
    getFilteredTrials,
    getFilteredVisitors,
    getFilteredPayments,
    getFilteredExpenses,
    getFilteredInventory,
    getFilteredAttendance,
    getFilteredSubscriptionPlans,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    addClub,
    updateClub,
    deleteClub,
    addMember,
    updateMember,
    deleteMember,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Export the AppContext for use in custom hooks
export { AppContext };
