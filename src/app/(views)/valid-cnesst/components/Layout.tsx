// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';
// import { useLanguage } from '../context/LanguageContext';

// const Layout = () => {
//   const { t } = useLanguage();
  
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Navbar />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />
//         <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
//           <Outlet />
//         </main>
//       </div>
//       <footer className="bg-white py-4 border-t border-gray-200 text-center text-gray-500 text-sm">
//         <p>{t('footerText')} &copy; {new Date().getFullYear()}</p>
//       </footer>
//     </div>
//   );
// };

// export default Layout;