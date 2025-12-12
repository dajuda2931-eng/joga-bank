import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-600 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 
          text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="text-xs text-red-400 ml-1">{error}</p>
            )}
        </div>
    );
};
