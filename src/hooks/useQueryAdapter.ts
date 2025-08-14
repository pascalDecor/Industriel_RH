import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { HttpService, PaginatedResult } from '@/utils/http.services';

// Types d'adaptateur
interface IndexQueryOptions<T> extends Omit<UseQueryOptions<PaginatedResult<T>>, 'queryKey' | 'queryFn'> {
  queryKey: unknown[];
  url: string;
  fromJson: (json: unknown) => T;
  params?: Record<string, string | number | boolean>;
  dataPath?: string | Array<string | number>;
  metaPath?: string | Array<string | number>;
}

interface ShowQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: unknown[];
  url: string;
  fromJson: (json: unknown) => T;
  data?: Record<string, unknown>;
}

interface MutationOptions<TData, TVariables> extends Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'> {
  url: string | ((variables: TVariables) => string);
  fromJson?: (json: any) => TData;
}

// Adaptateur principal
export class QueryAdapter {
  /**
   * Hook pour les requêtes index (listes paginées)
   */
  static useIndex<T>(options: IndexQueryOptions<T>) {
    const { queryKey, url, fromJson, params, dataPath, metaPath, ...queryOptions } = options;
    
    return useQuery({
      queryKey,
      queryFn: async (): Promise<PaginatedResult<T>> => {
        return await HttpService.index({
          url,
          fromJson,
          params,
          dataPath,
          metaPath
        });
      },
      ...queryOptions
    });
  }

  /**
   * Hook pour les requêtes show (élément unique)
   */
  static useShow<T>(options: ShowQueryOptions<T>) {
    const { queryKey, url, fromJson, data, ...queryOptions } = options;
    
    return useQuery({
      queryKey,
      queryFn: async () => {
        const result = await HttpService.show({
          url,
          fromJson,
          data
        });
        if (!result.data) {
          throw new Error('No data returned');
        }
        return result.data;
      },
      ...queryOptions
    });
  }

  /**
   * Hook pour les mutations create
   */
  static useCreate<TData = any, TVariables = Record<string, unknown>>(
    options: MutationOptions<TData, TVariables>
  ) {
    const { url, fromJson, ...mutationOptions } = options;
    
    return useMutation({
      mutationFn: async (variables: TVariables) => {
        const finalUrl = typeof url === 'function' ? url(variables) : url;
        const result = await HttpService.add({
          url: finalUrl,
          fromJson,
          data: variables as Record<string, unknown>
        });
        
        if (!result.state) {
          throw new Error('Erreur lors de la création');
        }
        
        return result.convertData || result.response?.data;
      },
      ...mutationOptions
    });
  }

  /**
   * Hook pour les mutations update
   */
  static useUpdate<TData = any, TVariables = Record<string, unknown>>(
    options: MutationOptions<TData, TVariables>
  ) {
    const { url, fromJson, ...mutationOptions } = options;
    
    return useMutation({
      mutationFn: async (variables: TVariables) => {
        const finalUrl = typeof url === 'function' ? url(variables) : url;
        const result = await HttpService.update({
          url: finalUrl,
          fromJson,
          data: variables as Record<string, unknown>
        });
        
        if (!result.state) {
          throw new Error('Erreur lors de la modification');
        }
        
        return result.convertData || result.response?.data;
      },
      ...mutationOptions
    });
  }

  /**
   * Hook pour les mutations delete
   */
  static useDelete<TData = any, TVariables = { id: string }>(
    options: MutationOptions<TData, TVariables>
  ) {
    const { url, fromJson, ...mutationOptions } = options;
    
    return useMutation({
      mutationFn: async (variables: TVariables) => {
        const finalUrl = typeof url === 'function' ? url(variables) : url;
        const result = await HttpService.delete({
          url: finalUrl,
          fromJson,
          data: variables as Record<string, unknown>
        });
        
        if (!result.state) {
          throw new Error('Erreur lors de la suppression');
        }
        
        return result.convertData || result.response?.data;
      },
      ...mutationOptions
    });
  }

  /**
   * Utilitaires pour la gestion optimiste
   */
  static createOptimisticUpdater<T>(
    queryClient: ReturnType<typeof useQueryClient>,
    queryKeyPattern: unknown[]
  ) {
    return {
      // Mise à jour optimiste pour les listes
      updateList: (
        id: string | number,
        updater: (item: T) => T
      ) => {
        queryClient.setQueriesData(
          { queryKey: queryKeyPattern },
          (old: PaginatedResult<T> | undefined) => {
            if (!old) return old;
            
            return {
              ...old,
              data: old.data.map(item => 
                (item as any).id === id ? updater(item) : item
              )
            };
          }
        );
      },

      // Ajout optimiste à une liste
      addToList: (newItem: T) => {
        queryClient.setQueriesData(
          { queryKey: queryKeyPattern },
          (old: PaginatedResult<T> | undefined) => {
            if (!old) return old;
            
            return {
              ...old,
              data: [newItem, ...old.data],
              meta: {
                ...old.meta,
                total: old.meta.total + 1
              }
            };
          }
        );
      },

      // Suppression optimiste d'une liste
      removeFromList: (id: string | number) => {
        queryClient.setQueriesData(
          { queryKey: queryKeyPattern },
          (old: PaginatedResult<T> | undefined) => {
            if (!old) return old;
            
            return {
              ...old,
              data: old.data.filter(item => (item as any).id !== id),
              meta: {
                ...old.meta,
                total: old.meta.total - 1
              }
            };
          }
        );
      },

      // Invalidation des requêtes
      invalidate: () => {
        queryClient.invalidateQueries({ queryKey: queryKeyPattern });
      }
    };
  }
}

// Hooks raccourcis pour les opérations courantes
export const useIndexQuery = QueryAdapter.useIndex;
export const useShowQuery = QueryAdapter.useShow;
export const useCreateMutation = QueryAdapter.useCreate;
export const useUpdateMutation = QueryAdapter.useUpdate;
export const useDeleteMutation = QueryAdapter.useDelete;