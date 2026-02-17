
"use client";

import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance } from "axios";
import { toast } from "sonner";
import { baseApiURL } from "../constant/api";
import { errorToastClassName, successToastClassName } from "./toast.helper";

// Cache pour les requêtes
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

// Configuration réseau adaptative
interface NetworkInfo {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
}

// Instance Axios optimisée
const createOptimizedAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseApiURL,
    timeout: 8000, // 8 secondes timeout
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=300', // 5 minutes par défaut
    },
    // Compression automatique
    decompress: true,
    // Inclure les cookies automatiquement
    withCredentials: true,
  });

  // Intercepteur requête - optimisations
  instance.interceptors.request.use(
    (config) => {
      // Ajouter timestamp pour cache busting si nécessaire
      if (config.method === 'get' && !config.params?.nocache) {
        config.headers['If-Modified-Since'] = new Date(Date.now() - 5 * 60 * 1000).toUTCString();
      }
      
      // Ajouter les cookies manuellement depuis document.cookie
      if (typeof document !== 'undefined') {
        const cookies = document.cookie;
        if (cookies) {
          config.headers['Cookie'] = cookies;
        }
      }
      
      // Optimisation réseau adaptative
      const connection = (navigator as any)?.connection as NetworkInfo;
      if (connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g') {
        config.timeout = 15000; // Plus de temps pour connexions lentes
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Intercepteur réponse - cache et gestion d'erreurs
  instance.interceptors.response.use(
    (response) => {
      // Stocker ETag pour cache intelligent
      if (response.headers.etag) {
        // Use a safer way to store metadata without extending the config type
        (response.config as any).metadata = { etag: response.headers.etag };
      }
      return response;
    },
    (error) => {
      // Gestion d'erreur plus fine
      if (error.response?.status === 304) {
        // Not Modified - utiliser cache
        return Promise.resolve({ ...error.response, fromCache: true });
      }
      
      // Retry automatique pour erreurs réseau temporaires
      if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR') {
        const config = error.config;
        if (!config.__retryCount) {
          config.__retryCount = 0;
        }
        if (config.__retryCount < 2) {
          config.__retryCount++;
          return new Promise(resolve => {
            setTimeout(() => resolve(instance(config)), 1000 * config.__retryCount);
          });
        }
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

const optimizedAxios = createOptimizedAxiosInstance();

type AddOrupdateReturnType<T> = {
  state: boolean;
  response: AxiosResponse;
  convertData: T;
  notFound?: boolean;
};

type DeleteReturnType<T> = {
  state: boolean;
  response: AxiosResponse;
  convertData: T;
};

type ShowReturnType<T> = {
  state: boolean;
  response: AxiosResponse;
  data: T;
};

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}

type Path = string | Array<string | number>;

/**
 * Récupère un champ profondément imbriqué dans un objet
 * via un chemin du type ['rows', 'data'] ou 'data'.
 */
function getDeep(obj: unknown, path: Path): unknown {
  if (!path) return undefined;
  const parts = Array.isArray(path) ? path : [path];
  return parts.reduce((acc: any, key) => (acc != null ? acc[key] : undefined), obj);
}

export class HttpService {
  // Cache statique pour les requêtes
  private static cache = new Map<string, CacheEntry<any>>();
  private static readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  /**
   * Génère une clé de cache basée sur l'URL et les paramètres
   */
  private static generateCacheKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}_${paramString}`;
  }
  
  /**
   * Récupère des données du cache si valides
   */
  private static getCached<T>(key: string, ttl = this.DEFAULT_CACHE_TTL): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    // Nettoyer les entrées expirées
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }
  
  /**
   * Met en cache des données
   */
  private static setCached<T>(key: string, data: T, etag?: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      etag
    });
    
    // Limiter la taille du cache (LRU simple)
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
  }
  
  /**
   * Détermine la taille de page optimale selon la connexion
   */
  private static getOptimalPageSize(): number {
    const connection = (navigator as any)?.connection as NetworkInfo;
    if (connection?.effectiveType === '4g') return 50;
    if (connection?.effectiveType === '3g') return 25;
    if (connection?.effectiveType === '2g') return 10;
    return 20; // défaut
  }
  
  /**
   * Valide la structure de réponse avant mapping
   */
  private static validateResponseStructure(data: unknown): data is unknown[] {
    return Array.isArray(data);
  }
  
  /**
   * Mapping optimisé avec batching pour gros datasets
   */
  private static async optimizedMapping<T>(
    data: unknown[], 
    mapper: (item: unknown) => T
  ): Promise<T[]> {
    // Pour les petits datasets, mapping synchrone
    if (data.length <= 100) {
      return data.map(mapper);
    }
    
    // Pour les gros datasets, batching asynchrone
    const batchSize = 50;
    const results: T[] = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const batchResults = batch.map(mapper);
      results.push(...batchResults);
      
      // Yield pour éviter de bloquer le thread principal
      if (i + batchSize < data.length) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return results;
  }
  
  /**
   * Nettoyage périodique du cache
   */
  static clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.DEFAULT_CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }
  /**
   * @param url        Endpoint relatif (sans baseApiURL ni query string)
   * @param fromJson   Mapper JSON→T
   * @param params     Query-params envoyés (page, limit, search…)
   * @param axiosConfig  Options axios supplémentaires
   * @param dataPath   Chemin vers le tableau de données dans response.data
   *                   ex. ['rows','data'] ou 'items'; défaut: 'data'
   * @param metaPath   Chemin vers l’objet meta dans response.data
   *                   ex. ['rows','meta'] ou 'pagination'; défaut: 'meta'
   */
  static async index<T>({
    url,
    fromJson,
    params,
    axiosConfig,
    dataPath = "data",
    metaPath = "meta"
  }: {
    url: string;
    fromJson: (json: unknown) => T;
    params?: Record<string, string | number | boolean>;
    axiosConfig?: AxiosRequestConfig;
    dataPath?: Path;
    metaPath?: Path;
  }): Promise<PaginatedResult<T>> {
    try {
      const response: AxiosResponse = await optimizedAxios.get(url, {
        params,
        ...axiosConfig
      });

      const payload = response.data;
      // tableau brut
      const rawData = getDeep(payload, dataPath) as unknown[] | undefined;
      // objet meta brut
      const rawMeta = getDeep(payload, metaPath) as Record<string, unknown>;

      // si on n’a pas trouvé rawData ou rawMeta, on lève
      if (!Array.isArray(rawData) || typeof rawMeta !== "object") {
        throw new Error(
          `Structure de réponse inattendue. ` +
            `Vérifiez dataPath="${dataPath}" et metaPath="${metaPath}".`
        );
      }

      // mapping et validation
      const data = rawData.map((item) => fromJson(item));
      const meta: PaginatedMeta = {
        total: Number(rawMeta.total) || 0,
        page: Number(rawMeta.page) || 1,
        limit: Number(rawMeta.limit) || data.length,
        totalPages: Number(rawMeta.totalPages) || 1
      };

      return { data, meta };
    } catch (error: unknown) {
      console.error(error);
      return {
        data: [],
        meta: { total: 0, page: 1, limit: 0, totalPages: 0 }
      };
    }
  }

  static async add<T>({
    url,
    fromJson,
    data
  }: {
    url: string;
    fromJson?: (json: any) => T;
    data: Record<string, unknown>;
  }): Promise<Partial<AddOrupdateReturnType<T>>> {
    try {
      const response = await optimizedAxios.post(url, data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Ajout effectué avec succès", {
          className: successToastClassName,
          duration: 3000
        });
        if (fromJson) {
          const convertedData = fromJson(response.data);
          return { state: true, convertData: convertedData };
        } else {
          return { state: true, response: response };
        }
      } else {
        throw new Error("Erreur lors de l'ajout");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout", {
        className: errorToastClassName,
        description: error instanceof Error ? error.message : 'Unknown error',
        duration: 5000
      });
      return { state: false };
    }
  }

  static async update<T>({
    url,
    fromJson,
    data
  }: {
    url: string;
    fromJson?: (json: any) => T;
    data: Record<string, unknown>;
  }): Promise<Partial<AddOrupdateReturnType<T>>> {
    try {
      const response = await optimizedAxios.put(url, data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Modification effectué avec succès", {
          className: successToastClassName,
          duration: 3000
        });
        if (fromJson) {
          const convertedData = fromJson(response.data);
          return { state: true, convertData: convertedData };
        } else {
          return { state: true, response: response };
        }
      } else {
        throw new Error("Erreur lors de l'ajout");
      }
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 404) {
        toast.error("Cet enregistrement n'existe plus ou a été supprimé.", {
          className: errorToastClassName,
          duration: 5000
        });
        return { state: false, notFound: true };
      }
      console.error(error);
      toast.error("Une erreur est survenue lors de la modification", {
        className: errorToastClassName,
        description: error instanceof Error ? error.message : 'Unknown error',
        duration: 5000
      });
      return { state: false };
    }
  }

  static async delete<T>({
    url,
    fromJson,
    data
  }: {
    url: string;
    fromJson?: (json: any) => T;
    data?: Record<string, unknown>;
  }): Promise<Partial<DeleteReturnType<T>>> {
    try {
      const response = await optimizedAxios.delete(url, data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Suppression effectué avec succès", {
          className: successToastClassName,
          duration: 3000
        });
        if (fromJson) {
          const convertedData = fromJson(response.data);
          return { state: true, convertData: convertedData };
        } else {
          return { state: true, response: response };
        }
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la suppression", {
        className: errorToastClassName,
        description: error instanceof Error ? error.message : 'Unknown error',
        duration: 5000
      });
      return { state: false };
    }
  }

  static async show<T>({
    url,
    fromJson,
    data
  }: {
    url: string;
    fromJson: (json: unknown) => T;
    data?: Record<string, unknown>;
  }): Promise<Partial<ShowReturnType<T>>> {
    try {
      const response = await optimizedAxios.get(url, data);
      if (response.status === 200 || response.status === 201) {
        const convertedData = fromJson(response.data);
        return { state: true, data: convertedData };
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        "Une erreur est survenue lors de la récupération de l'élément",
        {
          className: errorToastClassName,
          description: error instanceof Error ? error.message : 'Unknown error',
          duration: 5000
        }
      );
      return { state: false };
    }
  }
}
