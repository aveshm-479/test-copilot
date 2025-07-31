import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '../../utils/cn';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  success?: boolean;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    error, 
    label, 
    helperText, 
    success, 
    icon, 
    endIcon, 
    showPasswordToggle,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const inputType = type === 'password' && showPasswordToggle 
      ? (showPassword ? 'text' : 'password') 
      : type;

    const hasError = !!error;
    const hasSuccess = success && !hasError;

    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className={cn(
                "text-gray-400",
                hasError && "text-red-500",
                hasSuccess && "text-green-500",
                isFocused && "text-primary-500"
              )}>
                {icon}
              </div>
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400 dark:focus:ring-primary-400 transition-colors duration-200",
              icon && "pl-10",
              (endIcon || showPasswordToggle) && "pr-10",
              hasError && "border-red-500 dark:border-red-500 focus:ring-red-500",
              hasSuccess && "border-green-500 dark:border-green-500 focus:ring-green-500",
              !hasError && !hasSuccess && "border-gray-300 dark:border-gray-700",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {(endIcon || showPasswordToggle) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {showPasswordToggle && type === 'password' ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              ) : endIcon ? (
                <div className={cn(
                  "text-gray-400",
                  hasError && "text-red-500",
                  hasSuccess && "text-green-500"
                )}>
                  {endIcon}
                </div>
              ) : null}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        
        {hasSuccess && (
          <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Looks good!
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
