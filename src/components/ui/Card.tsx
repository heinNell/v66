import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardComponent extends React.FC<CardProps> {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
}

const Card: CardComponent = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  title, 
  subtitle, 
  icon,
  action,
  className = '' 
}) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-blue-600">{icon}</span>}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ 
  children,
  className = '' 
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ 
  children,
  className = '' 
}) => {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;