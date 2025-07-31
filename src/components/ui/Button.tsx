import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 shadow-md hover:shadow-lg',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 shadow-md hover:shadow-lg',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 hover:shadow-md',
        subtle: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100 dark:hover:text-white',
        link: 'bg-transparent underline-offset-4 hover:underline text-primary-600 dark:text-primary-400 hover:bg-transparent dark:hover:bg-transparent',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 dark:bg-secondary-700 dark:hover:bg-secondary-600 shadow-md hover:shadow-lg',
        success: 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 shadow-md hover:shadow-lg',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 shadow-md hover:shadow-lg',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 py-1 px-3 text-xs',
        lg: 'h-12 py-2 px-6 text-base',
        icon: 'h-10 w-10',
        xl: 'h-14 py-3 px-8 text-lg',
      },
      animation: {
        none: '',
        tilt: 'hover:animate-tilt-slow',
        glitch: 'hover:animate-glitch',
        pulse: 'hover:animate-pulse',
        bounce: 'hover:animate-bounce',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ripple?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation, 
    asChild = false,
    loading = false, 
    loadingText,
    leftIcon,
    rightIcon,
    ripple = true,
    children, 
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      
      // Add ripple effect
      if (ripple && !asChild) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const rippleElement = document.createElement('span');
        rippleElement.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
          z-index: 0;
        `;
        
        button.appendChild(rippleElement);
        setTimeout(() => rippleElement.remove(), 600);
      }
      
      onClick?.(e);
    };

    const buttonContent = (
      <>
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && leftIcon && (
          <span className="mr-2 -ml-1">
            {leftIcon}
          </span>
        )}
        
        <span className="relative z-10">
          {loading && loadingText ? loadingText : children}
        </span>
        
        {!loading && rightIcon && (
          <span className="ml-2 -mr-1">
            {rightIcon}
          </span>
        )}
      </>
    );

    if (asChild) {
      return (
        <button
          className={cn(buttonVariants({ variant, size, animation, className }))}
          ref={ref}
          disabled={isDisabled}
          onClick={handleClick}
          {...props}
        >
          {buttonContent}
        </button>
      );
    }

    return (
      <motion.button
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        ref={ref}
        className={cn(buttonVariants({ variant, size, animation, className }))}
        disabled={isDisabled}
        onClick={handleClick}
        {...(props as any)}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// Add ripple animation CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  if (!document.head.querySelector('[data-ripple-styles]')) {
    style.setAttribute('data-ripple-styles', 'true');
    document.head.appendChild(style);
  }
}

export { Button, buttonVariants };
