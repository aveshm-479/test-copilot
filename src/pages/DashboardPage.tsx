import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  UsersIcon, 
  UserPlusIcon, 
  CurrencyRupeeIcon, 
  CalendarIcon, 
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../hooks/useApp';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardPage = () => {
  // We'll use authState in future for permissions
  const { state, loadClubs, setSelectedClub } = useApp();
  const { clubs, selectedClub, dashboardMetrics, loading, error } = state;

  useEffect(() => {
    loadClubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ((clubs || []).length > 0 && !selectedClub) {
      setSelectedClub(clubs[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubs, selectedClub]);

  // Prepare data for charts
  const memberGrowthData = dashboardMetrics?.memberGrowth.map((value, index) => ({
    month: `Month ${index + 1}`,
    members: value,
  })) || [];

  const revenueData = dashboardMetrics?.revenueAnalytics.map((value, index) => ({
    month: `Month ${index + 1}`,
    revenue: value,
  })) || [];

  const visitorTrendData = dashboardMetrics?.visitorTrends.map((value, index) => ({
    day: `Day ${index + 1}`,
    visitors: value,
  })) || [];

  const stockData = dashboardMetrics?.stockLevels
    ? Object.entries(dashboardMetrics.stockLevels).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="p-6 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-lg font-medium text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          {(clubs || []).length > 1 && (
            <select
              className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              value={selectedClub?.id || ''}
              onChange={(e) => {
                const clubId = e.target.value;
                const club = clubs?.find((c) => c.id === clubId);
                if (club) {
                  setSelectedClub(club);
                }
              }}
            >
              {(clubs || []).map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Daily Visitors
                </CardTitle>
                <UsersIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardMetrics?.dailyVisitors}
                </div>
                <p className="text-xs text-green-500 dark:text-green-400">
                  +12% from last week
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  New Memberships
                </CardTitle>
                <UserPlusIcon className="w-6 h-6 text-secondary-500 dark:text-secondary-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardMetrics?.newMemberships}
                </div>
                <p className="text-xs text-green-500 dark:text-green-400">
                  +5% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Daily Revenue
                </CardTitle>
                <CurrencyRupeeIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(dashboardMetrics?.dailyRevenue || 0)}
                </div>
                <p className="text-xs text-green-500 dark:text-green-400">
                  +8% from yesterday
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Attendance Rate
                </CardTitle>
                <CalendarIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round((dashboardMetrics?.attendanceRate || 0) * 100)}%
                </div>
                <p className="text-xs text-green-500 dark:text-green-400">
                  +2% from last week
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Member Growth</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={memberGrowthData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="members" name="Members" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Visitor Trends</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={visitorTrendData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="visitors"
                        name="Visitors"
                        stroke="#00C49F"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stockData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Quantity']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="rounded-full p-2 bg-green-100 dark:bg-green-900 dark:bg-opacity-20">
                    <UserPlusIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      New member joined
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Rahul Sharma registered as a new member • 2 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20">
                    <CurrencyRupeeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Payment received
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Priya Patel made a payment of ₹7,500 • 3 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="rounded-full p-2 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20">
                    <ArchiveBoxIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Inventory updated
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Stock for Protein Shake was updated • 5 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900 dark:bg-opacity-20">
                    <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Attendance recorded
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      25 members marked present today • 6 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
