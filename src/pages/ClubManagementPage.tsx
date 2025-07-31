import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrashIcon, 
  PencilSquareIcon, 
  PlusCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../hooks/useApp';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SearchBar } from '../components/ui/Search';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';

// Form schema for creating/editing clubs
const clubSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  adminIds: z.array(z.string()).optional(),
});

type ClubFormValues = z.infer<typeof clubSchema>;

const ClubManagementPage = () => {
  const { state, addClub, updateClub, deleteClub } = useApp();
  const { clubs, users, loading, error } = state;
  const { addToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<string | null>(null);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter only admin users for assignment
  const adminUsers = users?.filter(user => 
    user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
  ) || [];

  // Filter clubs based on search term
  const filteredClubs = (clubs || []).filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClubFormValues>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      adminIds: [],
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isAddModalOpen && !editingClub) {
      reset();
      setSelectedAdmins([]);
    }
  }, [isAddModalOpen, editingClub, reset]);

  // Set form values when editing a club
  useEffect(() => {
    if (editingClub && clubs) {
      const club = clubs.find(club => club.id === editingClub);
      if (club) {
        setValue('name', club.name);
        setValue('address', club.address);
        setValue('phone', club.phone);
        setValue('email', club.email);
        setSelectedAdmins(club.adminIds || []);
      }
    }
  }, [editingClub, clubs, setValue]);

  const handleAdminToggle = (adminId: string) => {
    setSelectedAdmins(prevAdmins => {
      if (prevAdmins.includes(adminId)) {
        return prevAdmins.filter(id => id !== adminId);
      } else {
        return [...prevAdmins, adminId];
      }
    });
  };

  const onSubmit = async (data: ClubFormValues) => {
    setIsSubmitting(true);
    
    const clubData = {
      ...data,
      adminIds: selectedAdmins,
    };

    try {
      if (editingClub) {
        updateClub(editingClub, clubData);
        setEditingClub(null);
        addToast({
          title: "Success",
          message: "Club updated successfully",
          type: "success"
        });
      } else {
        addClub(clubData);
        setIsAddModalOpen(false);
        addToast({
          title: "Success",
          message: "Club added successfully",
          type: "success"
        });
      }

      reset();
      setSelectedAdmins([]);
    } catch (error) {
      addToast({
        title: "Error",
        message: "Failed to save club",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClub = (clubId: string) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      try {
        deleteClub(clubId);
        addToast({
          title: "Success",
          message: "Club deleted successfully",
          type: "success"
        });
      } catch (error) {
        addToast({
          title: "Error",
          message: "Failed to delete club",
          type: "error"
        });
      }
    }
  };

  const handleEditClub = (clubId: string) => {
    setEditingClub(clubId);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>

          {/* Club Cards Skeleton */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Skeleton className="w-5 h-5 mt-0.5" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
            ))}
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
            <BuildingOffice2Icon className="w-6 h-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Club Management</h1>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Add New Club</span>
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search clubs by name, address, or email..."
              suggestions={clubs
                ?.filter(club => club.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(0, 5)
                .map(club => club.name) || []
              }
              onSuggestionSelect={(suggestion) => setSearchTerm(suggestion)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
              <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{club.name}</CardTitle>
                  <div className="inline-flex items-center space-x-2">
                    <Button
                      onClick={() => handleEditClub(club.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClub(club.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <MapPinIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{club.address}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{club.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{club.email}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Assigned Admins:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {club.adminIds?.map((adminId) => {
                          const admin = users.find((u) => u.id === adminId);
                          return admin ? (
                            <span
                              key={adminId}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                            >
                              {admin.name}
                            </span>
                          ) : null;
                        })}
                        {(!club.adminIds || club.adminIds.length === 0) && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                            No admins assigned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                icon={<BuildingOffice2Icon className="w-12 h-12" />}
                title="No clubs found"
                description={searchTerm 
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first club to the community"
                }
                action={{
                  label: searchTerm ? "Clear search" : "Add First Club",
                  onClick: searchTerm 
                    ? () => setSearchTerm('') 
                    : () => setIsAddModalOpen(true)
                }}
              />
            </div>
          )}
        </div>

        {/* Add/Edit Club Modal */}
        {(isAddModalOpen || editingClub) && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full z-10 p-6"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingClub ? 'Edit Club' : 'Add New Club'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Club Name
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Club Name"
                    error={errors.name?.message}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <Input
                    {...register('address')}
                    placeholder="Full Address"
                    error={errors.address?.message}
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="club@example.com"
                    error={errors.email?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assign Admins
                  </label>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2 dark:border-gray-600">
                    {adminUsers.length > 0 ? (
                      adminUsers.map((admin) => (
                        <div key={admin.id} className="flex items-center space-x-2 py-1">
                          <input
                            type="checkbox"
                            id={`admin-${admin.id}`}
                            checked={selectedAdmins.includes(admin.id)}
                            onChange={() => handleAdminToggle(admin.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`admin-${admin.id}`}
                            className="text-gray-700 dark:text-gray-300"
                          >
                            {admin.name} ({admin.role})
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No admins available</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingClub(null);
                      reset();
                      setSelectedAdmins([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {editingClub ? 'Update Club' : 'Add Club'}
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

export default ClubManagementPage;
