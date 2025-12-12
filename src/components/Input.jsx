import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="space-y-1">
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
            <input
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all ${className}`}
                {...props}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
};
