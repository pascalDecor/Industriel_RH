import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-gray-100 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} SalaryIQ. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-error-500 animate-pulse-slow" />
            <span>and AI</span>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
            Disclaimer: Salary information is generated using AI and should be used as an estimation only. 
            Actual salaries may vary based on many factors including employer, location, market conditions, and individual qualifications.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;