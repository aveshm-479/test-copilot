import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrashIcon, 
  PencilSquareIcon, 
  PlusCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../hooks/useApp';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserRole } from '../types';

// Form schema for creating/editing admin users
const adminSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).optional(),
  role: z.enum([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  clubIds: z.array(z.string()).optional(),
});

type AdminFormValues = z.infer<typeof adminSchema>;

const AdminManagementPage = () => {
  const { state, addAdmin, updateAdmin, deleteAdmin } = useApp();
  const { users, clubs, loading, error } = state;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
  const [selectedClubs, setSelectedClubs] = useState<string[]>([]);

  // Filter only admin users
  const adminUsers = users?.filter(user => 
    user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN
  ) || [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      role: UserRole.ADMIN,
      clubIds: [],
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isAddModalOpen && !editingAdmin) {
      reset();
      setSelectedClubs([]);
    }
  }, [isAddModalOpen, editingAdmin, reset]);

  // Set form values when editing an admin
  useEffect(() => {
    if (editingAdmin) {
      const admin = users.find(user => user.id === editingAdmin);
      if (admin) {
        setValue('name', admin.name);
        setValue('email', admin.email);
        setValue('phone', admin.phone);
        setValue('role', admin.role as UserRole.SUPER_ADMIN | UserRole.ADMIN);
        setSelectedClubs(admin.clubIds || []);
      }
    }
  }, [editingAdmin, users, setValue]);

  const handleClubToggle = (clubId: string) => {
    setSelectedClubs(prevClubs => {
      if (prevClubs.includes(clubId)) {
        return prevClubs.filter(id => id !== clubId);
      } else {
        return [...prevClubs, clubId];
      }
    });
  };

  const onSubmit = (data: AdminFormValues) => {
    const adminData = {
      ...data,
      clubIds: selectedClubs,
    };

    if (editingAdmin) {
      updateAdmin(editingAdmin, adminData);
      setEditingAdmin(null);
    } else {
      addAdmin({
        ...adminData,
        password: data.password || 'defaultPassword123',
      });
      setIsAddModalOpen(false);
    }

    reset();
    setSelectedClubs([]);
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      deleteAdmin(adminId);
    }
  };

  const handleEditAdmin = (adminId: string) => {
    setEditingAdmin(adminId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Loading admin data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-6 h-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Management</h1>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Add New Admin</span>
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminUsers.map((admin) => (
            <motion.div
              key={admin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{admin.name}</CardTitle>
                  <div className="inline-flex items-center space-x-2">
                    <Button
                      onClick={() => handleEditAdmin(admin.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email:
                      </span>{' '}
                      <span className="text-gray-900 dark:text-gray-200">{admin.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Phone:
                      </span>{' '}
                      <span className="text-gray-900 dark:text-gray-200">{admin.phone}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Role:
                      </span>{' '}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {admin.role}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Assigned Clubs:
                      </span>{' '}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {admin.clubIds?.map((clubId: string) => {
                          const club = clubs?.find((c) => c.id === clubId);
                          return club ? (
                            <span
                              key={clubId}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200"
                            >
                              {club.name}
                            </span>
                          ) : null;
                        })}
                        {(!admin.clubIds || admin.clubIds.length === 0) && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                            No clubs assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Admin Modal */}
        {(isAddModalOpen || editingAdmin) && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full z-10 p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Full Name"
                    error={errors.name?.message}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="email@example.com"
                    error={errors.email?.message}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <Input
                    {...register('phone')}
                    placeholder="Phone Number"
                    error={errors.phone?.message}
                  />
                </div>

                {!editingAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <Input
                      {...register('password')}
                      type="password"
                      placeholder="Password"
                      error={errors.password?.message}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    {...register('role')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assign Clubs
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2 dark:border-gray-600">
                    {(clubs || []).length > 0 ? (
                      (clubs || []).map((club) => (
                        <div key={club.id} className="flex items-center space-x-2 py-1">
                          <input
                            type="checkbox"
                            id={`club-${club.id}`}
                            checked={selectedClubs.includes(club.id)}
                            onChange={() => handleClubToggle(club.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`club-${club.id}`}
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {club.name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No clubs available</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingAdmin(null);
                      reset();
                      setSelectedClubs([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAdmin ? 'Update Admin' : 'Add Admin'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminManagementPage;
