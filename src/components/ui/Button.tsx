import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  fullWidth,
  children,
  className = '',
  ...props
}) => {
  // Base classes
  let buttonClasses = 'inline-flex items-center justify-center font-medium transition-all rounded-md shadow-sm';
  
  // Variant classes
  switch (variant) {
    case 'primary':
      buttonClasses += ' bg-blue-700 hover:bg-blue-800 text-white border border-blue-800 hover:shadow';
      break;
    case 'secondary':
      buttonClasses += ' bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 hover:shadow';
      break;
    case 'outline':
      buttonClasses += ' bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:shadow';
      break;
    case 'danger':
      buttonClasses += ' bg-red-600 hover:bg-red-700 text-white border border-red-700 hover:shadow';
      break;
    case 'success':
      buttonClasses += ' bg-green-600 hover:bg-green-700 text-white border border-green-700 hover:shadow';
      break;
  }
  
  // Size classes
  switch (size) {
    case 'xs':
      buttonClasses += ' px-2 py-1 text-xs';
      break;
    case 'sm':
      buttonClasses += ' px-3 py-1.5 text-sm';
      break;
    case 'md':
      buttonClasses += ' px-4 py-2 text-sm';
      break;
    case 'lg':
      buttonClasses += ' px-6 py-3 text-base';
      break;
  }
  
  // Additional classes
  if (fullWidth) buttonClasses += ' w-full';
  if (props.disabled) buttonClasses += ' opacity-50 cursor-not-allowed';
  
  // Add custom classes
  buttonClasses += ` ${className}`;
  
  return (
    <button
      className={buttonClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;