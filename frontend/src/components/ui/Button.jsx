import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component supporting primary, secondary, outline, danger, success, ghost, and icon button styles.
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  isDisabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  iconOnly = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 border border-slate-900 shadow-sm',
    secondary: 'bg-amber-500 text-slate-950 hover:bg-amber-400 focus:ring-amber-500 font-semibold shadow-sm border border-amber-500',
    outline: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 focus:ring-slate-400 shadow-xs',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-sm border border-red-600',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-600 shadow-sm border border-emerald-600',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300',
    icon: 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus:ring-slate-400 p-2',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const iconSizes = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };

  const selectedSize = iconOnly ? iconSizes[size] : sizes[size];
  const disabled = isDisabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        selectedSize,
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : LeftIcon ? (
        <LeftIcon className="w-4 h-4 shrink-0" />
      ) : null}

      {!iconOnly && children}

      {!isLoading && RightIcon && (
        <RightIcon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
});

Button.displayName = 'Button';
