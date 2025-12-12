import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-black hover:bg-gray-800 text-white shadow-md focus:ring-gray-400",
        secondary: "bg-white hover:bg-gray-50 text-black border-2 border-gray-200 focus:ring-gray-300",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-md focus:ring-red-500",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-black"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
