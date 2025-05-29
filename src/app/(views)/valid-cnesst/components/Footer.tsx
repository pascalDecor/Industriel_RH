import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto text-center text-white/60 text-sm py-4">
      <p>© {new Date().getFullYear()} MortgageCalc. All numbers are estimates only.</p>
    </footer>
  );
};

export default Footer;