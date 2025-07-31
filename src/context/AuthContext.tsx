import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AuthState, User, UserRole } from '../types';
import { getMockUser } from '../utils/mockData';

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  loading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Auth context
interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  hasCreatedAdmin: (adminId: string) => boolean;
  canViewClub: (clubId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Auth provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // In a real app, we would validate the token with the API
          // For now, we'll use mock data
          const user = getMockUser();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token },
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({
            type: 'LOGIN_FAILURE',
            payload: 'Authentication failed',
          });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      // In a real app, we would call an API
      // For now, we'll simulate a successful login with mock data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      if (username === 'superadmin' && password === 'password') {
        const user = getMockUser(UserRole.SUPER_ADMIN);
        const token = 'mock-token-super-admin';
        localStorage.setItem('token', token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      } else if (username === 'admin' && password === 'password') {
        const user = getMockUser(UserRole.ADMIN);
        const token = 'mock-token-admin';
        localStorage.setItem('token', token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token },
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  // Check if user is a super admin
  const isSuperAdmin = () => {
    return authState.user?.role === UserRole.SUPER_ADMIN;
  };

  // Check if user is an admin
  const isAdmin = () => {
    return authState.user?.role === UserRole.ADMIN;
  };

  // Check if the current user created a specific admin
  const hasCreatedAdmin = (adminId: string) => {
    if (!authState.user) return false;
    
    // Super admin has access to all admins
    if (authState.user.role === UserRole.SUPER_ADMIN) return true;
    
    // Check if the admin is in the list of created admins
    return authState.user.createdAdmins?.some(admin => admin.id === adminId) || false;
  };

  // Check if the user can view a specific club
  const canViewClub = (clubId: string) => {
    if (!authState.user) return false;
    
    // Super admin can view all clubs
    if (authState.user.role === UserRole.SUPER_ADMIN) return true;
    
    // Admin can view their own clubs
    if (authState.user.clubs?.some(club => club.id === clubId)) return true;
    
    // Admin can view clubs of admins they created
    if (authState.user.createdAdmins) {
      for (const admin of authState.user.createdAdmins) {
        if (admin.clubs?.some(club => club.id === clubId)) {
          return true;
        }
      }
    }
    
    return false;
  };

  const value = {
    authState,
    login,
    logout,
    isSuperAdmin,
    isAdmin,
    hasCreatedAdmin,
    canViewClub,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
