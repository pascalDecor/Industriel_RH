import useSWR from 'swr';
import { Specialite } from '@/models/specialite';
import { Tag } from '@/models/tag';

interface BlogDataResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const fetcher = async (url: string): Promise<BlogDataResponse<any>> => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des données');
  }
  
  return response.json();
};

export const useBlogData = () => {
  const { 
    data: specialitesData, 
    error: specialitesError, 
    isLoading: specialitesLoading,
    mutate: mutateSpecialites
  } = useSWR<BlogDataResponse<any>>('/api/specialites?limit=100', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 300000, // 5 minutes
  });

  const { 
    data: tagsData, 
    error: tagsError, 
    isLoading: tagsLoading,
    mutate: mutateTags
  } = useSWR<BlogDataResponse<any>>('/api/tags?limit=100', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 300000, // 5 minutes
  });

  const specialites = specialitesData?.data?.map((s: any) => Specialite.fromJSON(s)) || [];
  const tags = tagsData?.data?.map((t: any) => Tag.fromJSON(t)) || [];
  
  const isLoading = specialitesLoading || tagsLoading;
  const error = specialitesError || tagsError;

  return {
    specialites,
    tags,
    isLoading,
    error,
    mutateSpecialites,
    mutateTags,
  };
};

export const useSpecialites = (options?: { limit?: number; search?: string }) => {
  const limit = options?.limit || 100;
  const search = options?.search || '';
  const queryString = `?limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR<BlogDataResponse<any>>(
    `/api/specialites${queryString}`, 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000,
    }
  );

  return {
    specialites: data?.data?.map((s: any) => Specialite.fromJSON(s)) || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
};

export const useTags = (options?: { limit?: number; search?: string }) => {
  const limit = options?.limit || 100;
  const search = options?.search || '';
  const queryString = `?limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR<BlogDataResponse<any>>(
    `/api/tags${queryString}`, 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000,
    }
  );

  return {
    tags: data?.data?.map((t: any) => Tag.fromJSON(t)) || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
};

export const createTag = async (libelle: string): Promise<Tag | null> => {
  try {
    const response = await fetch('/api/tags', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ libelle }),
    });

    if (response.ok) {
      const newTagData = await response.json();
      return Tag.fromJSON(newTagData);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la création du tag');
    }
  } catch (error) {
    console.error('Erreur lors de la création du tag:', error);
    throw error;
  }
};