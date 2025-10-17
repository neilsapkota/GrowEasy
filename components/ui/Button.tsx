import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    iconPosition = 'left',
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'btn-primary focus:ring-indigo-500',
        secondary: 'btn-secondary focus:ring-sky-500',
        success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 focus:ring-green-500 shadow-lg hover:shadow-green-500/40 hover-lift',
        warning: 'btn-accent focus:ring-yellow-500',
        error: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 focus:ring-rose-500 shadow-lg hover:shadow-rose-500/40 hover-lift',
        ghost: 'bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 focus:ring-slate-500 border border-slate-700 hover:border-slate-600 hover-lift'
    };
    
    const sizeClasses = {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    const transformClass = !disabled ? 'hover-lift' : '';
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${transformClass} ${className}`;
    
    return (
        <button
            className={classes}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {icon && iconPosition === 'left' && !loading && (
                <span className="mr-2" aria-hidden="true">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && !loading && (
                <span className="ml-2" aria-hidden="true">{icon}</span>
            )}
        </button>
    );
};

// Card Component
interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = false,
    padding = 'md'
}) => {
    const baseClasses = 'bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg';
    const hoverClass = hover ? 'card-hover' : '';
    
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };
    
    const classes = `${baseClasses} ${hoverClass} ${paddingClasses[padding]} ${className}`;
    
    return (
        <div className={classes}>
            {children}
        </div>
    );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    icon,
    className = '',
    ...props
}) => {
    const baseClasses = 'w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200';
    const errorClasses = error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : '';
    
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-slate-200">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-400" aria-hidden="true">{icon}</span>
                    </div>
                )}
                <input
                    className={`${baseClasses} ${errorClasses} ${icon ? 'pl-10' : ''} ${className}`}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
                    {...props}
                />
            </div>
            {error && (
                <p id={`${props.id}-error`} className="text-sm text-rose-400" role="alert">
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p id={`${props.id}-helper`} className="text-sm text-slate-400">
                    {helperText}
                </p>
            )}
        </div>
    );
};

// Badge Component
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';
    
    const variantClasses = {
        default: 'bg-slate-700 text-slate-200',
        success: 'bg-green-500/20 text-green-400 border border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
        error: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
        info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    };
    
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base'
    };
    
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    
    return (
        <span className={classes}>
            {children}
        </span>
    );
};
