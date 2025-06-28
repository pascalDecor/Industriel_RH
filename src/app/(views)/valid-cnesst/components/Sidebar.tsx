import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Upload, FileText, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';

const Sidebar = () => {
  const { t } = useLanguage();
  const [path, setPath] = useState("");

  const navItems = [
    { to: '/', icon: <LayoutDashboard className="h-5 w-5" />, label: t('dashboard') },
    { to: '/upload', icon: <Upload className="h-5 w-5" />, label: t('upload') },
    { to: '/settings', icon: <Settings className="h-5 w-5" />, label: t('settings') }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname);
    }
  }, []);

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${item.to === path
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-3 flex-shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;