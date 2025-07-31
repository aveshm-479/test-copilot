import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  PlusCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../hooks/useApp';

const FinancePage = () => {
  const { state } = useApp();
  const { payments, expenses, selectedClub, loading } = state;
  const [timeFilter, setTimeFilter] = useState('month');

  // Calculate totals
  const totalRevenue = (payments || [])
    .filter(payment => selectedClub ? payment.clubId === selectedClub.id : true)
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalExpenses = (expenses || [])
    .filter(expense => selectedClub ? expense.clubId === selectedClub.id : true)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Finance Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Track payments, expenses, and financial performance
            </p>
          </div>
          <div className="flex space-x-3">
            <Button>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Add Payment
            </Button>
            <Button variant="outline">
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <CurrencyDollarIcon className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${netProfit.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {netProfit >= 0 ? '+15%' : '-5%'} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(payments || []).filter(p => p.status === 'FULL').length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Time Filter */}
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(payments || []).slice(0, 5).map((payment) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Payment #{payment.id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        +${payment.amount}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.status}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {(payments || []).length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No payments found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(expenses || []).slice(0, 5).map((expense) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {expense.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(expense.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">
                        -${expense.amount}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {expense.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {(expenses || []).length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No expenses found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinancePage;
