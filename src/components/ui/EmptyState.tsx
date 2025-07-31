import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  ExclamationTriangleIcon,
  FaceFrownIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  WifiIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className,
  size = 'md'
}: EmptyStateProps) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-base'
    },
    lg: {
      container: 'py-16',
      icon: 'h-20 w-20',
      title: 'text-2xl',
      description: 'text-lg'
    }
  };

  const defaultIcon = <InboxIcon className={cn('text-gray-400', sizeClasses[size].icon)} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizeClasses[size].container,
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        {icon || defaultIcon}
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          'font-semibold text-gray-900 dark:text-white mb-2',
          sizeClasses[size].title
        )}
      >
        {title}
      </motion.h3>
      
      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'text-gray-500 dark:text-gray-400 mb-6 max-w-sm',
            sizeClasses[size].description
          )}
        >
          {description}
        </motion.p>
      )}
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={action.onClick}
            variant={action.variant || 'default'}
            size={size === 'lg' ? 'lg' : 'default'}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Predefined empty states for common scenarios
export const NoDataFound = ({ onRefresh }: { onRefresh?: () => void }) => (
  <EmptyState
    icon={<FaceFrownIcon className="h-16 w-16 text-gray-400" />}
    title="No data found"
    description="There's no data to display at the moment."
    action={onRefresh ? {
      label: "Refresh",
      onClick: onRefresh,
      variant: "outline"
    } : undefined}
  />
);

export const SearchNoResults = ({ searchTerm, onClear }: { 
  searchTerm: string; 
  onClear?: () => void; 
}) => (
  <EmptyState
    icon={<MagnifyingGlassIcon className="h-16 w-16 text-gray-400" />}
    title="No results found"
    description={`No results found for "${searchTerm}". Try adjusting your search terms.`}
    action={onClear ? {
      label: "Clear search",
      onClick: onClear,
      variant: "outline"
    } : undefined}
  />
);

export const NetworkError = ({ onRetry }: { onRetry?: () => void }) => (
  <EmptyState
    icon={<WifiIcon className="h-16 w-16 text-red-400" />}
    title="Connection error"
    description="Unable to connect to the server. Please check your internet connection."
    action={onRetry ? {
      label: "Try again",
      onClick: onRetry
    } : undefined}
  />
);

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
  className?: string;
}

export const ErrorBoundaryFallback = ({ 
  error, 
  resetError, 
  className 
}: ErrorBoundaryFallbackProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={cn(
      'min-h-[400px] flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800',
      className
    )}
  >
    <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mb-4" />
    <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
      Something went wrong
    </h2>
    <p className="text-red-600 dark:text-red-300 text-center mb-6 max-w-md">
      {error.message || 'An unexpected error occurred. Please try again.'}
    </p>
    <div className="flex gap-3">
      <Button
        onClick={resetError}
        leftIcon={<ArrowPathIcon className="h-4 w-4" />}
      >
        Try again
      </Button>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
      >
        Reload page
      </Button>
    </div>
    {import.meta.env.DEV && (
      <details className="mt-6 w-full max-w-2xl">
        <summary className="cursor-pointer text-red-600 dark:text-red-400 text-sm mb-2">
          Error details (development only)
        </summary>
        <pre className="bg-red-100 dark:bg-red-900/20 p-4 rounded text-xs overflow-auto text-red-800 dark:text-red-300">
          {error.stack}
        </pre>
      </details>
    )}
  </motion.div>
);

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState = ({ 
  message = "Loading...", 
  size = 'md',
  className 
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: { spinner: 'h-6 w-6', text: 'text-sm' },
    md: { spinner: 'h-8 w-8', text: 'text-base' },
    lg: { spinner: 'h-12 w-12', text: 'text-lg' }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex flex-col items-center justify-center py-12',
        className
      )}
    >
      <div className={cn(
        'animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 mb-4',
        sizeClasses[size].spinner
      )} />
      <p className={cn(
        'text-gray-600 dark:text-gray-400 font-medium',
        sizeClasses[size].text
      )}>
        {message}
      </p>
    </motion.div>
  );
};
