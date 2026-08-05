import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = id || Math.random().toString(36).substr(2, 9);
    
    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={generatedId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={generatedId}
          ref={ref}
          className={`flex h-11 w-full rounded-md border ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-sky-500'
          } bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
