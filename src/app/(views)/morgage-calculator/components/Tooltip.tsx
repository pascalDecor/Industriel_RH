"use client";

import React, { useState } from 'react';
import { HelpCircleIcon } from 'lucide-react';

interface TooltipProps {
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <HelpCircleIcon
        className="w-4 h-4 text-blue-500 cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      />
      {isVisible && (
        <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg -left-28 top-5 animate-fadeIn">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="border-8 border-transparent border-b-gray-800"></div>
          </div>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;