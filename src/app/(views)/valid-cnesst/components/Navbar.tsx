import React from 'react';
import { CheckCircle, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { t, toggleLanguage, language } = useLanguage();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">{t('appName')}</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'English' : 'Français'}
            </button>
            
            <Link
              href="/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {t('uploadDocument')}
            </Link>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === 'fr' ? 'English' : 'Français'}
            </button>
            
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => setMenuOpen(false)}
            >
              {t('uploadDocument')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;