import { QueryClient, QueryKey, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { HttpService, PaginatedResult } from './http.services';

/**
 * Adaptateur qui combine HttpService optimisé avec React Query
 * Offre le meilleur des deux mondes : cache HTTP + cache React Query
 */
export class QueryAdapter {
  private static queryClient: QueryClient | null = null;

  /**
   * Initialise l'adaptateur avec une instance QueryClient
   */
  static initialize(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Configuration optimisée pour différents types de données
   */
  private static getOptimizedQueryConfig(dataType: 'fast' | 'normal' | 'slow'): Partial<UseQueryOptions> {
    const configs = {
      fast: {
        staleTime: 2 * 60 * 1000, // 2 minutes pour données rapides
        cacheTime: 10 * 60 * 1000, // 10 minutes en mémoire
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      normal: {
        staleTime: 5 * 60 * 1000, // 5 minutes pour données normales
        cacheTime: 30 * 60 * 1000, // 30 minutes en mémoire
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
      slow: {
        staleTime: 15 * 60 * 1000, // 15 minutes pour données lentes
        cacheTime: 60 * 60 * 1000, // 1 heure en mémoire
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      }
    };
    return configs[dataType];
  }

  /**
   * Crée une factory de query function optimisée pour HttpService
   */
  static createQueryFn<T>({
    url,
    fromJson,
    params,
    dataType = 'normal'
  }: {
    url: string;
    fromJson: (json: unknown) => T;
    params?: Record<string, any>;
    dataType?: 'fast' | 'normal' | 'slow';
  }) {
    return {
      queryFn: async (): Promise<PaginatedResult<T>> => {
        return HttpService.index({ url, fromJson, params });
      },
      ...this.getOptimizedQueryConfig(dataType),
    };
  }

  /**
   * Crée une mutation function optimisée
   * Note: onSuccess et onError callbacks ont été supprimés car ils sont dépréciés dans les nouvelles versions de TanStack Query
   * Utilisez useEffect dans vos composants pour gérer les effets après mutation
   */
  static createMutationFn<T>({
    operation,
    successMessage,
    invalidateQueries = []
  }: {
    operation: (variables: any) => Promise<any>;
    successMessage?: string;
    invalidateQueries?: QueryKey[];
  }) {
    return {
      mutationFn: operation,
      // Note: Utilisez mutation.isSuccess et mutation.isError avec useEffect dans vos composants
      // pour gérer la logique post-mutation au lieu des callbacks dépréciés
    };
  }

  /**
   * Prefetch intelligent avec priorité
   */
  static async smartPrefetch<T>({
    queryKey,
    queryFn,
    priority = 'normal',
    force = false
  }: {
    queryKey: QueryKey;
    queryFn: () => Promise<T>;
    priority?: 'high' | 'normal' | 'low';
    force?: boolean;
  }) {
    if (!this.queryClient) return;

    // Vérifier si déjà en cache sauf si force=true
    if (!force && this.queryClient.getQueryData(queryKey)) {
      return;
    }

    const priorityConfigs = {
      high: { staleTime: 30 * 1000 }, // 30 secondes
      normal: { staleTime: 2 * 60 * 1000 }, // 2 minutes  
      low: { staleTime: 10 * 60 * 1000 } // 10 minutes
    };

    await this.queryClient.prefetchQuery({
      queryKey,
      queryFn,
      ...priorityConfigs[priority]
    });
  }

  /**
   * Batch prefetch pour plusieurs requêtes
   */
  static async batchPrefetch<T>(
    prefetchConfigs: Array<{
      queryKey: QueryKey;
      queryFn: () => Promise<T>;
      priority?: 'high' | 'normal' | 'low';
    }>
  ) {
    if (!this.queryClient) return;

    // Trier par priorité
    const sorted = prefetchConfigs.sort((a, b) => {
      const priorities = { high: 3, normal: 2, low: 1 };
      return priorities[b.priority || 'normal'] - priorities[a.priority || 'normal'];
    });

    // Exécuter en parallèle avec limite
    const batchSize = 3;
    for (let i = 0; i < sorted.length; i += batchSize) {
      const batch = sorted.slice(i, i + batchSize);
      await Promise.all(
        batch.map(config => 
          this.smartPrefetch({
            queryKey: config.queryKey,
            queryFn: config.queryFn,
            priority: config.priority
          })
        )
      );
    }
  }

  /**
   * Optimise automatiquement les queryKeys pour meilleur cache
   */
  static optimizeQueryKey(base: string, params: Record<string, any>): QueryKey {
    // Tri des paramètres pour cohérence du cache
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);

    return [base, sortedParams];
  }

  /**
   * Nettoie le cache selon des règles intelligentes
   */
  static smartCacheCleanup() {
    if (!this.queryClient) return;

    const queryCache = this.queryClient.getQueryCache();
    const queries = queryCache.getAll();

    queries.forEach(query => {
      const age = Date.now() - (query.state.dataUpdatedAt || 0);
      const isStale = age > ((query.options as any).staleTime || 0);
      const isUnused = query.getObserversCount() === 0;

      // Supprimer les queries anciennes et inutilisées
      if (isStale && isUnused && age > 30 * 60 * 1000) { // 30 minutes
        queryCache.remove(query);
      }
    });

    // Nettoyer aussi le cache HttpService
    HttpService.clearExpiredCache();
  }

  /**
   * Statistiques de performance du cache
   */
  static getCacheStats() {
    if (!this.queryClient) return null;

    const queryCache = this.queryClient.getQueryCache();
    const queries = queryCache.getAll();

    const stats = {
      totalQueries: queries.length,
      freshQueries: 0,
      staleQueries: 0,
      errorQueries: 0,
      cacheHitRate: 0
    };

    queries.forEach(query => {
      if (query.state.status === 'error') stats.errorQueries++;
      else if (query.isStale()) stats.staleQueries++;
      else stats.freshQueries++;
    });

    stats.cacheHitRate = stats.freshQueries / (stats.totalQueries || 1);

    return stats;
  }
}

// Auto-cleanup périodique
if (typeof window !== 'undefined') {
  setInterval(() => {
    QueryAdapter.smartCacheCleanup();
  }, 10 * 60 * 1000); // Toutes les 10 minutes
}