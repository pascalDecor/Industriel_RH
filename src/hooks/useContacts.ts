import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { QueryAdapter } from './useQueryAdapter';
import { HttpService } from '@/utils/http.services';
import { Contact } from '@/models/contact';

interface ContactsParams {
    page?: number;
    search?: string;
    status?: string;
}

export const useContacts = ({ page = 1, search = '', status = 'pending' }: ContactsParams = {}) => {
    const queryClient = useQueryClient();
    
    const query = QueryAdapter.useIndex({
        queryKey: ['contacts', { page, search, status }],
        url: '/contacts',
        fromJson: (json: any) => Contact.fromJSON(json),
        params: { page, search, status },
        enabled: true,
        staleTime: 10 * 60 * 1000, // 10 minutes pour contacts
        placeholderData: (previousData) => previousData,
    });

    // Handle prefetching when data is successfully loaded
    useEffect(() => {
        if (query.isSuccess && query.data) {
            const data = query.data;
            
            // Prefetch page suivante
            if (data.meta.page < data.meta.totalPages) {
                queryClient.prefetchQuery({
                    queryKey: ['contacts', { page: page + 1, search, status }],
                    queryFn: async () => {
                        const result = await HttpService.index<Contact>({
                            url: '/contacts',
                            fromJson: (json: any) => Contact.fromJSON(json),
                            params: { page: page + 1, search, status }
                        });
                        return result;
                    },
                    staleTime: 10 * 60 * 1000,
                });
            }
        }
    }, [query.isSuccess, query.data, queryClient, page, search, status]);

    return query;
};

// Hook pour prefetch tous les onglets
export const usePrefetchAllContactTabs = () => {
    const queryClient = useQueryClient();
    
    const prefetchAllTabs = (search = '') => {
        const statuses = ['pending', 'accepted', 'rejected'];
        
        statuses.forEach(status => {
            queryClient.prefetchQuery({
                queryKey: ['contacts', { page: 1, search, status }],
                queryFn: async () => {
                    return await HttpService.index<Contact>({
                        url: '/contacts',
                        fromJson: (json: any) => Contact.fromJSON(json),
                        params: { page: 1, search, status }
                    });
                },
                staleTime: 10 * 60 * 1000,
            });
        });
    };
    
    return { prefetchAllTabs };
};

export const useUpdateContactStatus = () => {
    const queryClient = useQueryClient();
    const optimisticUpdater = QueryAdapter.createOptimisticUpdater<Contact>(
        queryClient,
        ['contacts']
    );
    
    const mutation = QueryAdapter.useUpdate<any, { id: string; status: string }>({
        url: ({ id }) => `/contacts/${id}`,
    });

    // Handle optimistic updates and cache management with useEffect
    useEffect(() => {
        if (mutation.isPending && mutation.variables) {
            const { id, status } = mutation.variables;
            // Mise à jour optimiste
            optimisticUpdater.updateList(id, (contact) => Contact.fromJSON({ ...contact.toJSON(), status }));
        }
        
        if (mutation.isError) {
            // Annuler les optimistic updates en cas d'erreur
            optimisticUpdater.invalidate();
        }
        
        if (mutation.isSuccess) {
            // Revalider les données après succès
            optimisticUpdater.invalidate();
        }
    }, [mutation.isPending, mutation.isError, mutation.isSuccess, mutation.variables, optimisticUpdater]);

    return mutation;
};