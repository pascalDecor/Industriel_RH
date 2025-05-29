import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white py-3 px-6">
      <div className="container mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} Canadian Net Salary Calculator</p>
        <p className="text-blue-200 text-xs mt-1">
          *Disclaimer: This calculator provides estimates only. For accurate tax advice, please consult a tax professional.
        </p>
      </div>
    </footer>
  );
};