import useSWR from 'swr';
import { Sector } from '@/models/sector';
import { Notice } from '@/models/notice';
import { CacheInvalidator } from '@/utils/cache-invalidator';

interface AdminDataResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const fetcher = async (url: string): Promise<AdminDataResponse<any>> => {
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

// Hook pour les secteurs (liste)
export const useSectors = (options?: { 
  limit?: number; 
  search?: string; 
  includeCount?: boolean;
  page?: number;
}) => {
  const limit = options?.limit || 50;
  const search = options?.search || '';
  const includeCount = options?.includeCount || false;
  const page = options?.page || 1;
  
  const queryString = `?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}${includeCount ? '&includeCount=true' : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR<AdminDataResponse<any>>(
    `/api/sectors${queryString}`, 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    sectors: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
};

// Hook pour un secteur spécifique avec tous les détails
export const useSectorDetails = (sectorId: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(
    sectorId ? `/api/sectors/${sectorId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 600000, // 10 minutes (plus long car données plus stables)
    }
  );

  return {
    sector: data || null,
    isLoading,
    error,
    mutate,
  };
};

// Hook pour les avis/notices
export const useNotices = (options?: { 
  limit?: number; 
  search?: string; 
  stars?: number;
  page?: number;
}) => {
  const limit = options?.limit || 20;
  const search = options?.search || '';
  const stars = options?.stars;
  const page = options?.page || 1;
  
  const queryString = `?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}${stars ? `&stars=${stars}` : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR<AdminDataResponse<any>>(
    `/api/notices${queryString}`, 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 180000, // 3 minutes
    }
  );

  return {
    notices: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
};

// Hook pour les fonctions
export const useFunctions = (options?: { 
  limit?: number; 
  search?: string; 
  sectorId?: string;
  includeCount?: boolean;
  page?: number;
}) => {
  const limit = options?.limit || 50;
  const search = options?.search || '';
  const sectorId = options?.sectorId;
  const includeCount = options?.includeCount || false;
  const page = options?.page || 1;
  
  const queryString = `?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}${sectorId ? `&sectorId=${sectorId}` : ''}${includeCount ? '&includeCount=true' : ''}`;
  
  const { data, error, isLoading, mutate } = useSWR<AdminDataResponse<any>>(
    `/api/fonctions${queryString}`, 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  return {
    functions: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
};

// Hook générique pour n'importe quelle API d'administration
export const useAdminApi = <T>(
  endpoint: string, 
  options?: {
    limit?: number;
    search?: string;
    page?: number;
    filters?: Record<string, any>;
    cacheTTL?: number;
  }
) => {
  const limit = options?.limit || 50;
  const search = options?.search || '';
  const page = options?.page || 1;
  const filters = options?.filters || {};
  const cacheTTL = options?.cacheTTL || 300000; // 5 minutes par défaut
  
  // Construire la query string
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value.toString();
      }
      return acc;
    }, {} as Record<string, string>)
  });
  
  const { data, error, isLoading, mutate } = useSWR<AdminDataResponse<T>>(
    `${endpoint}?${params.toString()}`, 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: cacheTTL,
    }
  );

  return {
    data: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
};

// Fonctions utilitaires pour les opérations CRUD
export const createSector = async (data: { libelle: string; description: string }) => {
  const response = await fetch('/api/sectors', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création du secteur');
  }

  const result = await response.json();

  // Invalider automatiquement les caches après création
  await CacheInvalidator.invalidateSectors();

  return result;
};

export const createNotice = async (data: { content: string; author: string; stars: number }) => {
  const response = await fetch('/api/notices', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de l\'avis');
  }

  const result = await response.json();

  // Invalider automatiquement les caches après création
  await CacheInvalidator.invalidateNotices();

  return result;
};

export const createFunction = async (data: { libelle: string; sectorId: string }) => {
  const response = await fetch('/api/fonctions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de la fonction');
  }

  const result = await response.json();

  // Invalider automatiquement les caches après création
  await CacheInvalidator.invalidateFunctions();
  // Aussi invalider les secteurs car ils contiennent les fonctions
  await CacheInvalidator.invalidateSectors();

  return result;
};