import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="glass sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          <h1 className="text-xl font-bold text-primary-800 dark:text-primary-300">SalaryIQ</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a 
                href="#about" 
                className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#how-it-works" 
                className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
              >
                How it works
              </a>
            </li>
            <li>
              <a 
                href="#resources" 
                className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors"
              >
                Resources
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;