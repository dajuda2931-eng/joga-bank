import React from 'react';

export const Button = React.forwardRef(({ children, variant = 'primary', className = '', ...props }, ref) => {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-black dark:bg-teal-600 hover:bg-gray-800 dark:hover:bg-teal-700 text-white shadow-md focus:ring-gray-400 dark:focus:ring-teal-500",
        secondary: "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-black dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:ring-gray-300",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-md focus:ring-red-500",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
    };

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';
