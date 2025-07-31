import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrashIcon, 
  PencilSquareIcon, 
  PlusCircleIcon,
  UsersIcon,
  FunnelIcon,
  TagIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../hooks/useApp';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SearchBar } from '../components/ui/Search';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { MemberStatus } from '../types';

// Form schema for creating/editing members
const memberSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  status: z.enum([MemberStatus.VISITOR, MemberStatus.TRIAL, MemberStatus.ACTIVE, MemberStatus.INACTIVE]),
  joinDate: z.string().optional(),
  clubId: z.string(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

const MemberManagementPage = () => {
  const { state, addMember, updateMember, deleteMember } = useApp();
  const { members, clubs, selectedClub, loading, error } = state;
  const { addToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'ALL'>('ALL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      status: MemberStatus.VISITOR,
      clubId: selectedClub?.id || '',
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isAddModalOpen && !editingMember) {
      reset();
    }
  }, [isAddModalOpen, editingMember, reset]);

  // Set form values when editing a member
  useEffect(() => {
    if (editingMember) {
      const member = members.find(member => member.id === editingMember);
      if (member) {
        setValue('name', member.name);
        setValue('phone', member.phone);
        setValue('email', member.email);
        setValue('address', member.address);
        setValue('status', member.status);
        setValue('joinDate', member.joinDate || '');
        setValue('clubId', member.clubId);
      }
    }
  }, [editingMember, members, setValue]);

  // Filter members based on search term and status filter
  const filteredMembers = (members || [])
    .filter((member) => 
      (selectedClub ? member.clubId === selectedClub.id : true) &&
      (statusFilter === 'ALL' || member.status === statusFilter) &&
      (searchTerm === '' || 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      // Sort by status: VISITOR, TRIAL, ACTIVE, INACTIVE
      const statusOrder = {
        [MemberStatus.VISITOR]: 1,
        [MemberStatus.TRIAL]: 2,
        [MemberStatus.ACTIVE]: 3,
        [MemberStatus.INACTIVE]: 4,
      };
      return statusOrder[a.status] - statusOrder[b.status];
    });

  const onSubmit = async (data: MemberFormValues) => {
    setIsSubmitting(true);
    
    const memberData = {
      ...data,
      joinDate: data.joinDate || new Date().toISOString().split('T')[0],
    };

    try {
      if (editingMember) {
        updateMember(editingMember, memberData);
        setEditingMember(null);
        addToast({
          title: "Success",
          message: "Member updated successfully",
          type: "success"
        });
      } else {
        addMember(memberData);
        setIsAddModalOpen(false);
        addToast({
          title: "Success", 
          message: "Member added successfully",
          type: "success"
        });
      }

      reset();
    } catch (error) {
      addToast({
        title: "Error",
        message: "Failed to save member",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        deleteMember(memberId);
        addToast({
          title: "Success",
          message: "Member deleted successfully",
          type: "success"
        });
      } catch (error) {
        addToast({
          title: "Error", 
          message: "Failed to delete member",
          type: "error"
        });
      }
    }
  };

  const handleEditMember = (memberId: string) => {
    setEditingMember(memberId);
  };

  const getMemberStatusClass = (status: MemberStatus) => {
    switch (status) {
      case MemberStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case MemberStatus.TRIAL:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case MemberStatus.VISITOR:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case MemberStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
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
            <UsersIcon className="w-6 h-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Member Management</h1>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Add New Member</span>
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          {/* Enhanced Search */}
          <div className="flex-grow md:max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search members by name, email, phone..."
              suggestions={members
                .filter(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(0, 5)
                .map(member => member.name)
              }
              onSuggestionSelect={(suggestion) => setSearchTerm(suggestion)}
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MemberStatus | 'ALL')}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="ALL">All Status Types</option>
              <option value={MemberStatus.VISITOR}>Visitors</option>
              <option value={MemberStatus.TRIAL}>Trial Members</option>
              <option value={MemberStatus.ACTIVE}>Active Members</option>
              <option value={MemberStatus.INACTIVE}>Inactive Members</option>
            </select>
          </div>

          {/* Club selection (if user is super admin) */}
          {(clubs || []).length > 1 && (
            <div className="relative">
              <select
                value={selectedClub?.id || ''}
                onChange={(e) => {
                  const clubId = e.target.value;
                  const club = clubs?.find(c => c.id === clubId);
                  if (club) {
                    // You'll need to add this function to AppContext
                    // setSelectedClub(club);
                  }
                }}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Clubs</option>
                {(clubs || []).map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <motion.tr 
                      key={member.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {member.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <PhoneIcon className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                            {member.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <EnvelopeIcon className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                            {member.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMemberStatusClass(member.status)}`}>
                          <TagIcon className="w-3 h-3 mr-1" />
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            onClick={() => handleEditMember(member.id)}
                            variant="ghost"
                            size="sm"
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteMember(member.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-0">
                      <EmptyState
                        icon={<UsersIcon className="w-12 h-12" />}
                        title="No members found"
                        description={searchTerm || statusFilter !== 'ALL' 
                          ? "Try adjusting your search or filter criteria"
                          : "Get started by adding your first member to the community"
                        }
                        action={
                          searchTerm || statusFilter !== 'ALL' ? {
                            label: "Clear filters",
                            onClick: () => {
                              setSearchTerm('');
                              setStatusFilter('ALL');
                            },
                            variant: "outline" as const
                          } : {
                            label: "Add First Member",
                            onClick: () => setIsAddModalOpen(true)
                          }
                        }
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Member Modal */}
        {(isAddModalOpen || editingMember) && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full z-10 p-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Full Name"
                    error={errors.name?.message}
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
                    icon={<PhoneIcon className="w-5 h-5" />}
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
                    icon={<EnvelopeIcon className="w-5 h-5" />}
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
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value={MemberStatus.VISITOR}>Visitor</option>
                    <option value={MemberStatus.TRIAL}>Trial Member</option>
                    <option value={MemberStatus.ACTIVE}>Active Member</option>
                    <option value={MemberStatus.INACTIVE}>Inactive Member</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Join Date
                  </label>
                  <Input
                    {...register('joinDate')}
                    type="date"
                    error={errors.joinDate?.message}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Club
                  </label>
                  <select
                    {...register('clubId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {(clubs || []).map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingMember(null);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {editingMember ? 'Update Member' : 'Add Member'}
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

export default MemberManagementPage;
