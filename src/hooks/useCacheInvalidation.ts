import { CacheInvalidator } from '@/utils/cache-invalidator';

export const useCacheInvalidation = () => {
  return {
    // Invalidations spécifiques
    invalidateSectors: () => CacheInvalidator.invalidateSectors(),
    invalidateNotices: () => CacheInvalidator.invalidateNotices(),
    invalidateFunctions: () => CacheInvalidator.invalidateFunctions(),
    invalidateSpecialites: () => CacheInvalidator.invalidateSpecialites(),
    invalidateTags: () => CacheInvalidator.invalidateTags(),

    // Invalidation globale
    invalidateAll: () => CacheInvalidator.invalidateAll(),

    // Invalidations manuelles pour SWR ou React Query
    invalidateSWR: (pattern: string | RegExp) => CacheInvalidator.invalidateSWR(pattern),
    invalidateReactQuery: (queryKey: string[]) => CacheInvalidator.invalidateReactQuery(queryKey),
  };
};

// Hook pour utiliser après une modification manuelle
export const useForceRefresh = () => {
  const { invalidateAll } = useCacheInvalidation();

  return {
    refreshAll: invalidateAll,
    refreshAfterUpdate: async (entity: 'sectors' | 'notices' | 'functions' | 'specialites' | 'tags') => {
      const invalidators = {
        sectors: CacheInvalidator.invalidateSectors,
        notices: CacheInvalidator.invalidateNotices,
        functions: CacheInvalidator.invalidateFunctions,
        specialites: CacheInvalidator.invalidateSpecialites,
        tags: CacheInvalidator.invalidateTags,
      };

      await invalidators[entity]();
    }
  };
};