"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Conditional import for devtools to avoid build errors if package is missing
let ReactQueryDevtools: any = null;
if (process.env.NODE_ENV === 'development') {
  try {
    ReactQueryDevtools = require('@tanstack/react-query-devtools').ReactQueryDevtools;
  } catch (e) {
    console.warn('ReactQueryDevtools not available - install @tanstack/react-query-devtools for development');
  }
}

// Configuration optimisée du QueryClient
const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache par défaut optimisé
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Optimisations réseau
        networkMode: 'online',
      },
      mutations: {
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
        networkMode: 'online',
      },
    },
  });
};

// Context pour les optimisations globales
interface OptimizationContextType {
  // Préférences utilisateur
  prefetchEnabled: boolean;
  setPrefetchEnabled: (enabled: boolean) => void;
  
  // Métriques de performance
  networkQuality: 'slow' | 'fast' | 'offline';
  
  // Cache management
  clearCache: () => void;
  getCacheSize: () => number;
  
  // Préchargement intelligent
  prefetchCommonData: () => void;
  
  // État de l'application
  isOnline: boolean;
  
  // Statistiques
  queryStats: {
    totalQueries: number;
    cacheHits: number;
    cacheMisses: number;
  };
}

const OptimizationContext = createContext<OptimizationContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useOptimization = () => {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimization must be used within AppOptimizationProvider');
  }
  return context;
};

// Détection de la qualité réseau
const useNetworkQuality = () => {
  const [networkQuality, setNetworkQuality] = useState<'slow' | 'fast' | 'offline'>('fast');

  useEffect(() => {
    const updateNetworkQuality = () => {
      if (!navigator.onLine) {
        setNetworkQuality('offline');
        return;
      }

      const connection = (navigator as any)?.connection;
      if (connection) {
        const { effectiveType, downlink, rtt } = connection;
        
        if (effectiveType === '2g' || effectiveType === 'slow-2g' || downlink < 0.5 || rtt > 2000) {
          setNetworkQuality('slow');
        } else {
          setNetworkQuality('fast');
        }
      }
    };

    updateNetworkQuality();
    
    window.addEventListener('online', updateNetworkQuality);
    window.addEventListener('offline', updateNetworkQuality);
    
    if ((navigator as any)?.connection) {
      (navigator as any).connection.addEventListener('change', updateNetworkQuality);
    }

    return () => {
      window.removeEventListener('online', updateNetworkQuality);
      window.removeEventListener('offline', updateNetworkQuality);
      if ((navigator as any)?.connection) {
        (navigator as any).connection.removeEventListener('change', updateNetworkQuality);
      }
    };
  }, []);

  return networkQuality;
};

// État en ligne/hors ligne
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Provider principal
export const AppOptimizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => createOptimizedQueryClient());
  const [prefetchEnabled, setPrefetchEnabled] = useState(true);
  const [queryStats, setQueryStats] = useState({
    totalQueries: 0,
    cacheHits: 0,
    cacheMisses: 0,
  });

  const networkQuality = useNetworkQuality();
  const isOnline = useOnlineStatus();

  // Adapter les paramètres selon la qualité réseau
  useEffect(() => {
    const defaultOptions = queryClient.getDefaultOptions();
    
    if (networkQuality === 'slow') {
      queryClient.setDefaultOptions({
        queries: {
          ...defaultOptions.queries,
          staleTime: 15 * 60 * 1000, // 15 minutes pour réseau lent
          gcTime: 30 * 60 * 1000, // 30 minutes
          retry: 2, // Moins de retry
        },
      });
    } else if (networkQuality === 'fast') {
      queryClient.setDefaultOptions({
        queries: {
          ...defaultOptions.queries,
          staleTime: 5 * 60 * 1000, // 5 minutes pour réseau rapide
          gcTime: 10 * 60 * 1000, // 10 minutes
          retry: 3,
        },
      });
    }
  }, [networkQuality, queryClient]);

  // Nettoyage automatique du cache
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.clear();
      console.log('🧹 Cache automatiquement nettoyé');
    }, 30 * 60 * 1000); // Toutes les 30 minutes

    return () => clearInterval(interval);
  }, [queryClient]);

  // Fonctions utilitaires
  const clearCache = () => {
    queryClient.clear();
    console.log('🗑️ Cache manuel nettoyé');
  };

  const getCacheSize = () => {
    const cache = queryClient.getQueryCache();
    return cache.getAll().length;
  };

  const prefetchCommonData = () => {
    if (!prefetchEnabled || networkQuality === 'slow') return;
    
    // Précharger les données communes de l'application
    queryClient.prefetchQuery({
      queryKey: ['user-profile'],
      queryFn: async () => {
        // Simuler récupération profil utilisateur
        return {};
      },
      staleTime: 30 * 60 * 1000, // 30 minutes
    });

    queryClient.prefetchQuery({
      queryKey: ['app-settings'],
      queryFn: async () => {
        // Simuler récupération paramètres app
        return {};
      },
      staleTime: 60 * 60 * 1000, // 1 heure
    });
  };

  // Statistiques des requêtes
  useEffect(() => {
    const cache = queryClient.getQueryCache();
    
    const updateStats = () => {
      const queries = cache.getAll();
      setQueryStats({
        totalQueries: queries.length,
        cacheHits: queries.filter(q => q.state.data && !q.state.isInvalidated).length,
        cacheMisses: queries.filter(q => !q.state.data || q.state.isInvalidated).length,
      });
    };

    // Observer les changements du cache
    const unsubscribe = cache.subscribe(updateStats);
    updateStats(); // Initial update

    return unsubscribe;
  }, [queryClient]);

  const contextValue: OptimizationContextType = {
    prefetchEnabled,
    setPrefetchEnabled,
    networkQuality,
    clearCache,
    getCacheSize,
    prefetchCommonData,
    isOnline,
    queryStats,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <OptimizationContext.Provider value={contextValue}>
        {children}
        {process.env.NODE_ENV === 'development' && ReactQueryDevtools && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </OptimizationContext.Provider>
    </QueryClientProvider>
  );
};

// Hook pour les métriques de performance
export const usePerformanceMetrics = () => {
  const { queryStats, networkQuality, isOnline, getCacheSize } = useOptimization();
  
  return {
    // Métriques cache
    cacheHitRate: queryStats.totalQueries > 0 
      ? (queryStats.cacheHits / queryStats.totalQueries * 100).toFixed(2) + '%'
      : '0%',
    cacheSize: getCacheSize(),
    
    // Métriques réseau
    networkQuality,
    isOnline,
    
    // Statistiques générales
    ...queryStats,
  };
};

// Hook pour le contrôle du cache
export const useCacheControl = () => {
  const { clearCache, prefetchCommonData, prefetchEnabled, setPrefetchEnabled } = useOptimization();
  
  return {
    clearCache,
    prefetchCommonData,
    prefetchEnabled,
    setPrefetchEnabled,
    
    // Fonctions avancées
    clearExpiredCache: () => {
      const queryClient = new QueryClient();
      queryClient.clear();
    },
    
    invalidatePattern: (pattern: string[]) => {
      const queryClient = new QueryClient();
      queryClient.invalidateQueries({ queryKey: pattern });
    },
  };
};

// Component de monitoring des performances (dev only)
export const PerformanceMonitor: React.FC = () => {
  const metrics = usePerformanceMetrics();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white text-xs p-3 rounded-lg font-mono">
      <div className="space-y-1">
        <div>🎯 Cache Hit Rate: {metrics.cacheHitRate}</div>
        <div>📦 Cache Size: {metrics.cacheSize}</div>
        <div>🌐 Network: {metrics.networkQuality}</div>
        <div>📶 Online: {metrics.isOnline ? '✅' : '❌'}</div>
      </div>
    </div>
  );
};