import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  showFilters?: boolean;
  onFiltersClick?: () => void;
  debounceMs?: number;
  className?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  suggestions = [],
  onSuggestionSelect,
  showFilters = false,
  onFiltersClick,
  debounceMs = 300,
  className
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce the search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  // Filter suggestions based on current value
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
  ).slice(0, 5);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        isFocused && "ring-2 ring-primary-500 ring-opacity-50 rounded-lg"
      )}>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className={cn(
              "h-5 w-5 transition-colors duration-200",
              isFocused ? "text-primary-500" : "text-gray-400"
            )} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            placeholder={placeholder}
            className={cn(
              "block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-400",
              "focus:outline-none focus:border-primary-500 focus:ring-0",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500",
              "transition-colors duration-200"
            )}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center">
            <AnimatePresence>
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClear}
                  className="p-1.5 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
            
            {showFilters && (
              <button
                onClick={onFiltersClick}
                className="p-1.5 mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="flex items-center">
                  <MagnifyingGlassIcon className="h-4 w-4 mr-3 text-gray-400" />
                  {suggestion}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
  removable?: boolean;
  onRemove?: () => void;
}

export const FilterChip = ({ 
  label, 
  active, 
  onClick, 
  count, 
  removable = false, 
  onRemove 
}: FilterChipProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
        active
          ? "bg-primary-100 text-primary-800 border border-primary-200 dark:bg-primary-900 dark:text-primary-200 dark:border-primary-700"
          : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
          active
            ? "bg-primary-200 text-primary-800 dark:bg-primary-800 dark:text-primary-200"
            : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
        )}>
          {count}
        </span>
      )}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </motion.button>
  );
};

interface QuickFiltersProps {
  filters: Array<{
    key: string;
    label: string;
    count?: number;
  }>;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  className?: string;
}

export const QuickFilters = ({ 
  filters, 
  activeFilter, 
  onFilterChange, 
  className 
}: QuickFiltersProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <FilterChip
          key={filter.key}
          label={filter.label}
          active={activeFilter === filter.key}
          onClick={() => onFilterChange(filter.key)}
          count={filter.count}
        />
      ))}
    </div>
  );
};
