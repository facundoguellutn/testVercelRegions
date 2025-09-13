'use client';

import { ReactNode } from 'react';

interface TestButtonProps {
  children: ReactNode;
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function TestButton({ 
  children, 
  onClick, 
  loading = false, 
  disabled = false, 
  variant = 'primary',
  className = ''
}: TestButtonProps) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:hover:bg-blue-600",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white disabled:hover:bg-gray-200 dark:disabled:hover:bg-gray-700"
  };

  const handleClick = async () => {
    if (loading || disabled) return;
    await onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}