"use client";

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function AccessDeniedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* Logo */}
          <div className="mx-auto flex items-center justify-center mb-4">
            <Logo priority={true} width={150} height={50} className='mx-auto w-50' />
          </div>
          
          {/* Icône d'erreur */}
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg 
              className="h-6 w-6 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accès Refusé
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vous n'avez pas les privilèges nécessaires pour accéder à cette ressource
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Privilèges insuffisants
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  La documentation API est réservée au personnel technique et administratif d'Industrielle RH.
                  Votre compte ({user?.email}) ne dispose pas des privilèges nécessaires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {user && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Informations de votre compte :
            </h3>
            <dl className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <dt>Nom :</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Email :</dt>
                <dd className="font-medium">{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Rôle :</dt>
                <dd className="font-medium capitalize">{user.role}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Si vous pensez que c'est une erreur, contactez l'administrateur système.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour à l'accueil
            </Link>
            
            <button
              onClick={logout}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Pour demander l'accès, contactez :{' '}
            <a 
              href="mailto:tech@industriellerh.ca" 
              className="text-blue-600 hover:underline"
            >
              tech@industriellerh.ca
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}