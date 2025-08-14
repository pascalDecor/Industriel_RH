"use client";

import Logo from '@/components/ui/Logo';

export default function TestLogoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12">Test du composant Logo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Logo normal</h2>
            <div className="flex justify-center">
              <Logo />
            </div>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center text-white">Logo sur fond sombre</h2>
            <div className="flex justify-center">
              <Logo />
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Logo petit</h2>
            <div className="flex justify-center">
              <Logo 
                className="h-8 w-auto object-contain" 
                width={100} 
                height={32}
              />
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-center">Logo sans texte de fallback</h2>
            <div className="flex justify-center">
              <Logo showFallbackText={false} />
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white p-8 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">Test avec logo forcé en erreur</h2>
          <p className="text-gray-600 text-center mb-4">
            Ouvrez les outils de développement et regardez la console pour voir les tentatives de chargement
          </p>
          <div className="flex justify-center">
            <div className="text-center">
              <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-full bg-blue-100 mb-2">
                <svg 
                  className="h-6 w-6 text-blue-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-blue-900">Industrielle RH</h3>
              <p className="text-sm text-gray-500">Fallback affiché</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Cette page de test peut être supprimée en production. 
            Elle sert uniquement à vérifier le bon fonctionnement du composant Logo.
          </p>
        </div>
      </div>
    </div>
  );
}