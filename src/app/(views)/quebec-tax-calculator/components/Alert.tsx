import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AlertProps {
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700">{message}</p>
      </div>
    </div>
  );
};