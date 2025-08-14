import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { QueryAdapter } from './useQueryAdapter';
import { HttpService } from '@/utils/http.services';
import { Sector } from '@/models/sector';

interface SectorsParams {
    page?: number;
    search?: string;
    limit?: number;
}

// Hook principal pour les secteurs
export const useSectors = ({ page = 1, search = '', limit = 20 }: SectorsParams = {}) => {
    const queryClient = useQueryClient();
    
    const query = QueryAdapter.useIndex({
        queryKey: ['sectors', { page, search, limit }],
        url: '/sectors',
        fromJson: (json: any) => Sector.fromJSON(json),
        params: { page, search, limit },
        enabled: true,
        staleTime: 10 * 60 * 1000, // 10 minutes pour secteurs
        placeholderData: (previousData) => previousData,
    });

    // Handle prefetching when data is successfully loaded
    useEffect(() => {
        if (query.isSuccess && query.data) {
            const data = query.data;
            
            // Prefetch page suivante
            if (data.meta.page < data.meta.totalPages) {
                queryClient.prefetchQuery({
                    queryKey: ['sectors', { page: page + 1, search, limit }],
                    queryFn: async () => {
                        return await HttpService.index<Sector>({
                            url: '/sectors',
                            fromJson: (json: any) => Sector.fromJSON(json),
                            params: { page: page + 1, search, limit }
                        });
                    },
                    staleTime: 10 * 60 * 1000,
                });
            }
            
            // Prefetch détails des premiers secteurs pour navigation rapide
            data.data.slice(0, 3).forEach((sector) => {
                queryClient.prefetchQuery({
                    queryKey: ['sector', sector.id],
                    queryFn: async () => {
                        const result = await HttpService.show<Sector>({
                            url: `/sectors/${sector.id}`,
                            fromJson: (json: any) => Sector.fromJSON(json)
                        });
                        return result.data;
                    },
                    staleTime: 15 * 60 * 1000, // 15 minutes pour détails
                });
            });
        }
    }, [query.isSuccess, query.data, queryClient, page, search, limit]);

    return query;
};

// Hook pour un secteur spécifique
export const useSector = (id: string) => {
    return QueryAdapter.useShow({
        queryKey: ['sector', id],
        url: `/sectors/${id}`,
        fromJson: (json: any) => Sector.fromJSON(json),
        enabled: !!id,
        staleTime: 15 * 60 * 1000, // 15 minutes
    });
};

// Hook pour créer un secteur
export const useCreateSector = () => {
    const queryClient = useQueryClient();
    const optimisticUpdater = QueryAdapter.createOptimisticUpdater<Sector>(
        queryClient,
        ['sectors']
    );
    
    const mutation = QueryAdapter.useCreate<Sector, { libelle: string; description?: string }>({
        url: '/sectors',
        fromJson: (json: any) => Sector.fromJSON(json),
    });

    // Handle optimistic updates and cache management with useEffect
    useEffect(() => {
        if (mutation.isPending && mutation.variables) {
            // Créer un secteur temporaire pour l'optimistic update
            const tempSector = Sector.fromJSON({
                id: 'temp-' + Date.now(),
                libelle: mutation.variables.libelle,
                description: mutation.variables.description,
                createdAt: new Date(),
                functions: [],
                _count: { functions: 0 }
            });
            
            optimisticUpdater.addToList(tempSector);
        }
        
        if (mutation.isError) {
            optimisticUpdater.invalidate();
        }
        
        if (mutation.isSuccess && mutation.data) {
            // Remplacer le secteur temporaire par le vrai
            optimisticUpdater.invalidate();
            
            // Mettre en cache le nouveau secteur
            queryClient.setQueryData(['sector', mutation.data.id], mutation.data);
        }
    }, [mutation.isPending, mutation.isError, mutation.isSuccess, mutation.data, mutation.variables, optimisticUpdater, queryClient]);

    return mutation;
};

// Hook pour mettre à jour un secteur
export const useUpdateSector = () => {
    const queryClient = useQueryClient();
    const optimisticUpdater = QueryAdapter.createOptimisticUpdater<Sector>(
        queryClient,
        ['sectors']
    );
    
    const mutation = QueryAdapter.useUpdate<Sector, { id: string; libelle?: string; description?: string }>({
        url: ({ id }) => `/sectors/${id}`,
        fromJson: (json: any) => Sector.fromJSON(json),
    });

    // Handle optimistic updates and cache management with useEffect
    useEffect(() => {
        if (mutation.isPending && mutation.variables) {
            const { id, ...updates } = mutation.variables;
            
            // Mise à jour optimiste
            optimisticUpdater.updateList(id, (sector) => 
                Sector.fromJSON({ ...sector.toJSON(), ...updates, updatedAt: new Date() })
            );
            
            // Mettre à jour le cache individuel
            queryClient.setQueryData(['sector', id], (old: Sector | undefined) => {
                if (!old) return old;
                return Sector.fromJSON({ ...old.toJSON(), ...updates, updatedAt: new Date() });
            });
        }
        
        if (mutation.isError) {
            optimisticUpdater.invalidate();
        }
        
        if (mutation.isSuccess && mutation.data && mutation.variables) {
            const { id } = mutation.variables;
            // Mettre à jour les caches
            queryClient.setQueryData(['sector', id], mutation.data);
            optimisticUpdater.updateList(id, () => mutation.data);
        }
    }, [mutation.isPending, mutation.isError, mutation.isSuccess, mutation.data, mutation.variables, optimisticUpdater, queryClient]);

    return mutation;
};

// Hook pour supprimer un secteur
export const useDeleteSector = () => {
    const queryClient = useQueryClient();
    const optimisticUpdater = QueryAdapter.createOptimisticUpdater<Sector>(
        queryClient,
        ['sectors']
    );
    
    const mutation = QueryAdapter.useDelete<any, { id: string }>({
        url: ({ id }) => `/sectors/${id}`,
    });

    // Handle optimistic updates and cache management with useEffect
    useEffect(() => {
        if (mutation.isPending && mutation.variables) {
            // Suppression optimiste
            optimisticUpdater.removeFromList(mutation.variables.id);
        }
        
        if (mutation.isError) {
            // Annuler la suppression optimiste
            optimisticUpdater.invalidate();
        }
        
        if (mutation.isSuccess && mutation.variables) {
            const { id } = mutation.variables;
            // Nettoyer les caches
            queryClient.removeQueries({ queryKey: ['sector', id] });
            queryClient.invalidateQueries({ queryKey: ['sectors'] });
        }
    }, [mutation.isPending, mutation.isError, mutation.isSuccess, mutation.variables, optimisticUpdater, queryClient]);

    return mutation;
};

// Hook pour recherche temps réel avec debounce
export const useSectorsSearch = (searchTerm: string, delayMs: number = 300) => {
    const queryClient = useQueryClient();
    
    return QueryAdapter.useIndex({
        queryKey: ['sectors-search', searchTerm],
        url: '/sectors',
        fromJson: (json: any) => Sector.fromJSON(json),
        params: { search: searchTerm, limit: 10 },
        enabled: searchTerm.length >= 2, // Recherche à partir de 2 caractères
        staleTime: 2 * 60 * 1000, // 2 minutes pour recherche
    });
};

// Hook pour prefetch intelligent basé sur la navigation
export const useSectorsPrefetch = () => {
    const queryClient = useQueryClient();
    
    const prefetchSectorsByIds = (sectorIds: string[]) => {
        sectorIds.forEach(id => {
            queryClient.prefetchQuery({
                queryKey: ['sector', id],
                queryFn: async () => {
                    const result = await HttpService.show<Sector>({
                        url: `/sectors/${id}`,
                        fromJson: (json: any) => Sector.fromJSON(json)
                    });
                    return result.data;
                },
                staleTime: 15 * 60 * 1000,
            });
        });
    };
    
    const prefetchPopularSectors = () => {
        queryClient.prefetchQuery({
            queryKey: ['sectors', 'popular'],
            queryFn: async () => {
                return await HttpService.index<Sector>({
                    url: '/sectors',
                    fromJson: (json: any) => Sector.fromJSON(json),
                    params: { sort: 'popular', limit: 10 }
                });
            },
            staleTime: 30 * 60 * 1000, // 30 minutes
        });
    };
    
    return {
        prefetchSectorsByIds,
        prefetchPopularSectors
    };
};

// Hook pour statistiques des secteurs (cache long)
export const useSectorsStats = () => {
    return QueryAdapter.useShow({
        queryKey: ['sectors-stats'],
        url: '/sectors/stats',
        fromJson: (json: any) => ({
            total: json.total,
            withFunctions: json.with_functions,
            mostPopular: json.most_popular?.map((s: any) => Sector.fromJSON(s)) || [],
            recentlyAdded: json.recently_added?.map((s: any) => Sector.fromJSON(s)) || []
        }),
        staleTime: 60 * 60 * 1000, // 1 heure pour stats
    });
};