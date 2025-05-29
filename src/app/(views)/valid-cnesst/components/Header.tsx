import React from 'react';
import { HomeIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="mb-6 flex items-center">
      <div className="flex items-center gap-2 bg-white/10 py-2 px-4 rounded-full">
        <HomeIcon className="text-white h-5 w-5" />
        <h1 className="text-xl font-medium text-white">MortgageCalc</h1>
      </div>
    </header>
  );
};

export default Header;