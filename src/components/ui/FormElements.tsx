import React from 'react';

interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string | false;
  onBlur?: () => void;
  step?: string;
  min?: string;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  required, 
  error, 
  onBlur,
  step,
  min,
  disabled,
  className = ''
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      onBlur={onBlur}
      step={step}
      min={min}
      disabled={disabled}
      className={`w-full border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string | false;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  required, 
  error, 
  onBlur,
  disabled,
  className = ''
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      onBlur={onBlur}
      disabled={disabled}
      className={`w-full border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string | false;
  disabled?: boolean;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 3, 
  required, 
  error, 
  disabled,
  className = ''
}) => (
  <div className="flex flex-col">
    {label && (
      <label className="mb-1 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

export { TextArea as Textarea };

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: FileList | null) => void;
  error?: string | false;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept, 
  multiple, 
  onFileSelect,
  error,
  className = ''
}) => (
  <div className={`flex flex-col ${className}`}>
    {label && <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>}
    <input
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={(e) => onFileSelect(e.target.files)}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
        file:rounded-md file:border-0 file:text-sm file:font-medium 
        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
        file:cursor-pointer cursor-pointer border border-gray-300 rounded-md shadow-sm"
    />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);

// Default export optional
export default {
  Input,
  Select,
  TextArea,
  FileUpload
};