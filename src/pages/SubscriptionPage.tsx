import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../hooks/useApp';

const SubscriptionPage = () => {
  const { state } = useApp();
  const { subscriptionPlans, members, selectedClub, loading } = state;
  const [activeTab, setActiveTab] = useState('plans');

  // Filter subscription plans for selected club
  const filteredPlans = (subscriptionPlans || [])
    .filter(plan => selectedClub ? plan.clubId === selectedClub.id : true);

  // Get active subscriptions (members with subscription plans)
  const activeSubscriptions = (members || [])
    .filter(member => selectedClub ? member.clubId === selectedClub.id : true)
    .filter(member => member.subscriptionPlanId);

  // Calculate statistics
  const totalPlans = filteredPlans.length;
  const totalSubscribers = activeSubscriptions.length;
  const monthlyRevenue = activeSubscriptions.reduce((sum, member) => {
    const plan = filteredPlans.find(p => p.id === member.subscriptionPlanId);
    return sum + (plan ? plan.price : 0);
  }, 0);

  const getPlanColor = (index: number) => {
    const colors = [
      'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
      'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20',
      'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
      'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
    ];
    return colors[index % colors.length];
  };

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
              Subscription Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage subscription plans and member subscriptions
            </p>
          </div>
          <Button>
            <PlusCircleIcon className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
              <CreditCardIcon className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlans}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Available subscription plans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <CheckIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalSubscribers}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active subscriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <CurrencyDollarIcon className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                From active subscriptions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('plans')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'plans'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Subscription Plans
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscribers'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Active Subscribers
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            {filteredPlans.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`relative ${getPlanColor(index)}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <PencilSquareIcon className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${plan.price}
                          <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                            /{plan.duration}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {plan.description}
                        </p>
                        <ul className="space-y-2">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Subscribers</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {activeSubscriptions.filter(sub => sub.subscriptionPlanId === plan.id).length}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent>
                  <div className="text-center py-12">
                    <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      No subscription plans
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by creating your first subscription plan.
                    </p>
                    <div className="mt-6">
                      <Button>
                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                        Create Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'subscribers' && (
          <Card>
            <CardHeader>
              <CardTitle>Active Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              {activeSubscriptions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Member
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Plan
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Start Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          End Date
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeSubscriptions.map((member) => {
                        const plan = filteredPlans.find(p => p.id === member.subscriptionPlanId);
                        const isActive = new Date(member.membershipEndDate) > new Date();
                        
                        return (
                          <motion.tr
                            key={member.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {member.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {member.email}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {plan?.name || 'Unknown Plan'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  ${plan?.price || 0}/{plan?.duration || 'month'}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900 dark:text-white">
                                {new Date(member.membershipStartDate).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900 dark:text-white">
                                {new Date(member.membershipEndDate).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isActive
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {isActive ? (
                                  <>
                                    <CheckIcon className="w-3 h-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <ClockIcon className="w-3 h-3 mr-1" />
                                    Expired
                                  </>
                                )}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No active subscribers
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Members will appear here when they subscribe to plans.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
