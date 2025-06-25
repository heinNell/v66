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
    <div className={`card ${className}`}>
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
    <div className={`card-header ${className}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
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
    <div className={`card-content ${className}`}>
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
    <div className={`px-6 py-3 bg-slate-50 border-t border-slate-200 ${className}`}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;