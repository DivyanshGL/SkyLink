import React, { HTMLAttributes } from 'react';

export const Card = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const CardHeader: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

export const CardContent: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 flex items-center ${className}`}>{children}</div>
);
