import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  ChartBarIcon,
  ArchiveBoxIcon,
  CalendarIcon,
  CreditCardIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { UserRole } from '../../types';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  to: string;
  label: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
  role?: UserRole[];
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { authState, logout } = useAuth();
  const location = useLocation();

  const navItems: NavItemProps[] = [
    { 
      to: '/dashboard', 
      label: 'Dashboard', 
      icon: <HomeIcon className="w-5 h-5" /> 
    },
    { 
      to: '/admins', 
      label: 'Admin Management', 
      icon: <UsersIcon className="w-5 h-5" />,
      role: [UserRole.SUPER_ADMIN, UserRole.ADMIN]
    },
    { 
      to: '/clubs', 
      label: 'Club Management', 
      icon: <BriefcaseIcon className="w-5 h-5" /> 
    },
    { 
      to: '/members', 
      label: 'Members', 
      icon: <UsersIcon className="w-5 h-5" /> 
    },
    { 
      to: '/finance', 
      label: 'Finance', 
      icon: <ChartBarIcon className="w-5 h-5" /> 
    },
    { 
      to: '/inventory', 
      label: 'Inventory', 
      icon: <ArchiveBoxIcon className="w-5 h-5" /> 
    },
    { 
      to: '/attendance', 
      label: 'Attendance', 
      icon: <CalendarIcon className="w-5 h-5" /> 
    },
    { 
      to: '/subscription', 
      label: 'Subscription Plans', 
      icon: <CreditCardIcon className="w-5 h-5" /> 
    },
    { 
      to: '/settings', 
      label: 'Settings', 
      icon: <CogIcon className="w-5 h-5" /> 
    },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.role) return true;
    
    if (authState.user?.role === UserRole.SUPER_ADMIN) return true;
    
    return item.role.includes(authState.user?.role as UserRole);
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={toggleSidebar}
        />

        {/* Mobile sidebar */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative flex flex-col w-64 h-full max-w-xs py-4 bg-white dark:bg-gray-800"
        >
          <div className="absolute top-0 right-0 pt-2 pr-2">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleSidebar}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center px-4 mb-8">
            <h1 className="ml-2 text-xl font-bold text-primary-600 dark:text-primary-400">
              Magical Community
            </h1>
          </div>
          <nav className="flex-1 space-y-2 px-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                  location.pathname === item.to
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900 dark:bg-opacity-20 dark:text-primary-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 mt-auto">
            <button
              onClick={toggleTheme}
              className="flex items-center px-4 py-2 mb-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <>
                  <SunIcon className="w-5 h-5" />
                  <span className="ml-3">Light Mode</span>
                </>
              ) : (
                <>
                  <MoonIcon className="w-5 h-5" />
                  <span className="ml-3">Dark Mode</span>
                </>
              )}
            </button>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Sidebar for desktop */}
      <motion.aside
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 256, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex lg:flex-shrink-0"
      >
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow h-screen pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center px-4 mb-8">
              <h1 className="ml-2 text-xl font-bold text-primary-600 dark:text-primary-400">
                Magical Community
              </h1>
            </div>
            <nav className="flex-1 space-y-2 px-2">
              {filteredNavItems.map((item) => (
                <motion.div
                  key={item.to}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out",
                      location.pathname === item.to
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900 dark:bg-opacity-20 dark:text-primary-400"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    )}
                  >
                    {location.pathname === item.to && item.activeIcon
                      ? item.activeIcon
                      : item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-4 mt-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={toggleTheme}
                className="flex items-center px-4 py-2 mb-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {theme === "dark" ? (
                  <>
                    <SunIcon className="w-5 h-5" />
                    <span className="ml-3">Light Mode</span>
                  </>
                ) : (
                  <>
                    <MoonIcon className="w-5 h-5" />
                    <span className="ml-3">Dark Mode</span>
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="ml-3">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="z-10 py-4 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="lg:hidden">
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {authState.user?.name || 'User'}
                    </div>
                    <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      {authState.user?.role === UserRole.SUPER_ADMIN 
                        ? 'Super Admin' 
                        : 'Admin'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
