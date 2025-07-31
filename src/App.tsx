import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { 
  LoginPage,
  DashboardPage,
  AdminManagementPage,
  ClubManagementPage,
  MemberManagementPage,
  FinancePage,
  InventoryPage,
  AttendancePage,
  SubscriptionPage,
  SettingsPage
} from './pages';
import PrivateRoute from './components/auth/PrivateRoute';
import { UserRole } from './types';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route 
                  path="/admins" 
                  element={
                    <PrivateRoute requiredRole={UserRole.SUPER_ADMIN}>
                      <AdminManagementPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/clubs" 
                  element={
                    <PrivateRoute requiredRole={UserRole.SUPER_ADMIN}>
                      <ClubManagementPage />
                    </PrivateRoute>
                  } 
                />
                <Route path="/members" element={<MemberManagementPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
  );
}

export default App;
