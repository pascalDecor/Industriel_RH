"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SwaggerUI from 'swagger-ui-react';
import { useAuth } from '@/hooks/useAuth';
import 'swagger-ui-react/swagger-ui.css';

/**
 * Documentation API. Accès contrôlé par le proxy (token + rôle : SUPER_ADMIN, HR_DIRECTOR, HR_MANAGER, IT_ENGINEER).
 */
export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const loadSwaggerSpec = async () => {
      try {
        const response = await fetch('/api/swagger', { credentials: 'include' });
        // if (response.status === 401 || response.status === 403) {
        //   router.replace('/auth/login?redirect=/api-docs');
        //   return;
        // }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const swaggerSpec = await response.json();
        setSpec(swaggerSpec);
      } catch (err) {
        console.error('Erreur chargement Swagger:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    loadSwaggerSpec();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la documentation API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <p className="text-gray-600">
            Impossible de charger la documentation API. Veuillez vérifier que le fichier swagger.json est accessible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header personnalisé avec authentification */}
      <div className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Documentation API - Industrielle RH</h1>
              <p className="text-blue-200">
                API REST pour la plateforme de recrutement industriel
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">Connecté en tant que</p>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-blue-300 capitalize">Rôle: {user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors"
                title="Se déconnecter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-blue-800 px-3 py-1 rounded">
              Version: {spec?.info?.version}
            </span>
            <span className="bg-blue-800 px-3 py-1 rounded">
              OpenAPI: {spec?.openapi}
            </span>
            <span className="bg-green-700 px-3 py-1 rounded">
              🔒 Accès sécurisé
            </span>
          </div>
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="font-semibold text-gray-700">Accès rapide:</span>
            <a href="#tag/Contacts" className="text-blue-600 hover:underline">Contacts</a>
            <span className="text-gray-400">•</span>
            <a href="#tag/Applications" className="text-blue-600 hover:underline">Candidatures</a>
            <span className="text-gray-400">•</span>
            <a href="#tag/Recrutements" className="text-blue-600 hover:underline">Recrutements</a>
            <span className="text-gray-400">•</span>
            <a href="#tag/Calculs-Salariaux" className="text-blue-600 hover:underline">Calculs Salariaux</a>
            <span className="text-gray-400">•</span>
            <a href="#tag/Référentiels" className="text-blue-600 hover:underline">Référentiels</a>
          </div>
        </div>
      </div>

      {/* Informations importantes */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Note importante:</strong> Cette API est destinée à un usage interne. 
                Certains endpoints peuvent nécessiter une authentification. 
                Contactez l'équipe technique pour obtenir les clés d'accès.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Swagger UI */}
      <div className="swagger-container">
        <SwaggerUI 
          spec={spec}
          deepLinking={true}
          displayOperationId={false}
          defaultModelsExpandDepth={1}
          defaultModelExpandDepth={1}
          docExpansion="list"
          filter={true}
          showExtensions={true}
          showCommonExtensions={true}
          tryItOutEnabled={true}
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 Industrielle RH Inc. Tous droits réservés.</p>
          <p className="text-gray-400 text-sm">
            Pour toute question concernant cette API, contactez: 
            <a href="mailto:contact@industriellerh.com" className="text-blue-400 hover:underline ml-1">
              contact@industriellerh.com
            </a>
          </p>
        </div>
      </div>

      <style jsx global>{`
        .swagger-container .swagger-ui .topbar {
          display: none;
        }
        
        .swagger-container .swagger-ui .info {
          margin: 20px 0;
        }
        
        .swagger-container .swagger-ui .scheme-container {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          margin: 20px 0;
        }
        
        /* Personnalisation des couleurs */
        .swagger-container .swagger-ui .opblock.opblock-post {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }
        
        .swagger-container .swagger-ui .opblock.opblock-post .opblock-summary-method {
          background: #10b981;
        }
        
        .swagger-container .swagger-ui .opblock.opblock-get {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .swagger-container .swagger-ui .opblock.opblock-get .opblock-summary-method {
          background: #3b82f6;
        }
        
        .swagger-container .swagger-ui .opblock.opblock-put {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }
        
        .swagger-container .swagger-ui .opblock.opblock-put .opblock-summary-method {
          background: #f59e0b;
        }
        
        .swagger-container .swagger-ui .opblock.opblock-delete {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        
        .swagger-container .swagger-ui .opblock.opblock-delete .opblock-summary-method {
          background: #ef4444;
        }
      `}</style>
    </div>
  );
}