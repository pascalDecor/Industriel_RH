import React, { ReactNode } from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  max?: string;
  step?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  tooltip?: ReactNode;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  type = 'text',
  min,
  max,
  step,
  error,
  prefix,
  suffix,
  tooltip,
  className
}) => {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-blue-900 mb-1 flex items-center">
        {label}
        {tooltip && <span className="ml-1">{tooltip}</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          id={id}
          className={`block w-full rounded-md border text-slate-600 ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } py-3 ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-7' : 'pr-3'} ${className} focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;