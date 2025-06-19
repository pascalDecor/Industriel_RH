"use client";


import React, { ReactNode } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import clsx from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  tooltip?: ReactNode;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  tooltip,
  className
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-blue-900 mb-1 flex items-center">
        {label}
        {tooltip && <span className="ml-1">{tooltip}</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        <select
          id={id}
          className={clsx(
            'block w-full rounded-md border border-gray-300 py-3 pl-3 pr-10 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 appearance-none transition-all',
            className
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDownIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default SelectField;