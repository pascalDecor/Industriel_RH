import { NextResponse } from 'next/server'

interface QueryError {
  message: string;
  code: string;
  details?: any;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

interface SortParams<T> {
  sortBy?: keyof T;
  sortOrder: 'asc' | 'desc';
}

interface WhereClause {
  [key: string]: any;
  OR?: any[];
}

interface CacheConfig {
  enabled?: boolean;
  ttlMs?: number;
  maxSize?: number;
  keyPrefix?: string;
}

interface SelectField {
  [key: string]: boolean | SelectField;
}

interface ComplexSearchConfig {
  relationFields?: Record<string, {
    relation: string;
    searchField: string;
  }[]>;
}

export interface QueryOptions<T> {
  // Recherche full-text
  searchFields?: (keyof T)[]                           
  // Recherche complexe dans les relations
  complexSearch?: ComplexSearchConfig
  // Champs autorisés pour le tri
  sortFields?: (keyof T)[]                             
  defaultSortBy?: keyof T
  defaultSortOrder?: 'asc' | 'desc'
  // Pagination
  maxLimit?: number
  // Filtres scalaires simples
  filterFields?: Partial<Record<string, keyof T>>      
  // Callback pour filtres relationnels complexes
  modifyWhere?: (where: any, params: URLSearchParams) => void 
  // Comptage des relations associées
  countFields?: (keyof T | string)[]                            
  // Chargement des relations (include)
  includeFields?: (keyof T | string)[]
  // Include conditionnel basé sur les paramètres (relations uniquement)
  conditionalIncludes?: Record<string, {
    param: string;
    value?: string;
    include: any;
  }>
  // Select de base toujours inclus
  baseSelect?: SelectField
  // Champs scalaires conditionnels (ajoutés au select de base)
  conditionalFields?: Record<string, {
    param: string;
    value?: string;
  }>
  // Configuration du cache
  cache?: CacheConfig
  // Soft-delete / archivage
  archivedField?: keyof T | string        
  defaultArchived?: boolean      
  // Activation / désactivation
  activeField?: keyof T          
  defaultActive?: boolean        
  // Historique / révisions
  historyRelation?: keyof T      
}

const validatePagination = (page: string | null, limit: string | null, maxLimit: number): ValidationResult => {
  const errors: string[] = [];
  
  if (page && (!/^\d+$/.test(page) || parseInt(page) < 1)) {
    errors.push('Page must be a positive integer');
  }
  
  if (limit && (!/^\d+$/.test(limit) || parseInt(limit) < 1 || parseInt(limit) > maxLimit)) {
    errors.push(`Limit must be between 1 and ${maxLimit}`);
  }
  
  return { isValid: errors.length === 0, errors };
};

const sanitizeSearchTerm = (search: string): string => {
  return search
    .replace(/[<>]/g, '')
    .replace(/['"]/g, '')
    .trim()
    .slice(0, 200);
};

const validateSortField = <T>(sortBy: string, sortFields: (keyof T)[], defaultSortBy?: keyof T): keyof T | undefined => {
  if (sortFields.length > 0 && sortBy) {
    const isValid = sortFields.some(field => String(field) === sortBy);
    return isValid ? sortBy as keyof T : defaultSortBy;
  }
  return sortBy as keyof T || defaultSortBy;
};

const createQueryError = (message: string, code: string, details?: any): NextResponse => {
  console.error(`[withQuery] ${code}: ${message}`, details);
  return NextResponse.json({
    error: { message, code },
    timestamp: new Date().toISOString()
  }, { status: 400 });
};

// Cache global simple (en production, utiliser Redis)
const globalCache = new Map<string, { data: any; timestamp: number }>();

const getCacheKey = (prefix: string, params: URLSearchParams): string => {
  const sortedParams = Array.from(params.entries()).sort();
  return `${prefix}:${JSON.stringify(sortedParams)}`;
};

const getFromCache = (key: string, ttlMs: number): any | null => {
  const cached = globalCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.data;
  }
  return null;
};

const setCache = (key: string, data: any, maxSize: number): void => {
  // Nettoyer le cache si trop plein
  if (globalCache.size >= maxSize) {
    const entries = Array.from(globalCache.entries());
    entries.slice(0, Math.floor(maxSize / 2)).forEach(([k]) => globalCache.delete(k));
  }
  
  globalCache.set(key, { data, timestamp: Date.now() });
};

const buildComplexSearch = (
  search: string,
  searchFields: (keyof any)[],
  complexSearch?: ComplexSearchConfig
): any[] => {
  const orConditions: any[] = [];
  
  // Recherche dans les champs directs
  searchFields.forEach(field => {
    orConditions.push({
      [field as string]: { contains: search, mode: 'insensitive' }
    });
  });
  
  // Recherche dans les relations complexes
  if (complexSearch?.relationFields) {
    Object.entries(complexSearch.relationFields).forEach(([_, relations]) => {
      relations.forEach(({ relation, searchField }) => {
        orConditions.push({
          [relation]: {
            some: {
              [searchField]: { contains: search, mode: 'insensitive' }
            }
          }
        });
      });
    });
  }
  
  return orConditions;
};

export function withQuery<T, M extends {
  count(args: any): Promise<number>
  findMany(args: any): Promise<T[]>
}>(model: M, opts: QueryOptions<T>) {
  const {
    searchFields = [],
    complexSearch,
    sortFields = [],
    defaultSortBy,
    defaultSortOrder = 'asc',
    maxLimit = 100,
    filterFields = {},
    modifyWhere,
    countFields = [],
    includeFields = [],
    conditionalIncludes = {},
    baseSelect,
    conditionalFields = {},
    cache = { enabled: false, ttlMs: 300000, maxSize: 100, keyPrefix: 'query' },
    archivedField,
    defaultArchived = false,
    activeField,
    defaultActive = true,
    historyRelation,
  } = opts

  return async function GET(req: Request) {
    try {
      const url = new URL(req.url)
      const qp = url.searchParams

      // Vérification du cache en premier
      if (cache.enabled) {
        const cacheKey = getCacheKey(cache.keyPrefix!, qp);
        const cached = getFromCache(cacheKey, cache.ttlMs!);
        if (cached) {
          return NextResponse.json(cached);
        }
      }

      // Validation de la pagination
      const pageParam = qp.get('page')
      const limitParam = qp.get('limit')
      const paginationValidation = validatePagination(pageParam, limitParam, maxLimit)
      
      if (!paginationValidation.isValid) {
        return createQueryError(
          'Invalid pagination parameters',
          'INVALID_PAGINATION',
          paginationValidation.errors
        )
      }

      // Pagination sécurisée
      const page = Math.max(1, parseInt(pageParam || '1', 10))
      const limit = Math.min(maxLimit, parseInt(limitParam || '10', 10))
      const skip = (page - 1) * limit

      // Tri sécurisé
      const sortByParam = qp.get('sortBy')
      const sortBy = validateSortField(sortByParam || '', sortFields, defaultSortBy)
      const sortOrder = qp.get('sortOrder') === 'desc' ? 'desc' : defaultSortOrder

      // Construction sécurisée du where
      const where: WhereClause = {}

      // Archivage avec validation
      if (archivedField) {
        const archParam = qp.get('archived')
        if (archParam !== null && archParam !== 'true' && archParam !== 'false') {
          return createQueryError(
            'Archived parameter must be true or false',
            'INVALID_ARCHIVED_PARAM'
          )
        }
        where[archivedField as string] =
          archParam !== null ? archParam === 'true' : defaultArchived
      }

      // Activation avec validation
      if (activeField) {
        const actParam = qp.get('active')
        if (actParam !== null && actParam !== 'true' && actParam !== 'false') {
          return createQueryError(
            'Active parameter must be true or false',
            'INVALID_ACTIVE_PARAM'
          )
        }
        where[activeField as string] =
          actParam !== null ? actParam === 'true' : defaultActive
      }

      // Filtres scalaires avec validation
      for (const [param, field] of Object.entries(filterFields)) {
        const val = qp.get(param)
        if (val !== null && field) {
          if (val.length > 255) {
            return createQueryError(
              `Filter parameter ${param} is too long`,
              'FILTER_TOO_LONG'
            )
          }
          // Conversion automatique des booléens pour les champs spécifiques
          if (param === 'published' || param === 'active' || param === 'archived') {
            if (val !== 'true' && val !== 'false') {
              return createQueryError(
                `${param} parameter must be true or false`,
                'INVALID_BOOLEAN_PARAM'
              )
            }
            where[field as string] = val === 'true'
          } else {
            where[field as string] = val
          }
        }
      }

      // Filtres relationnels
      if (modifyWhere) {
        try {
          modifyWhere(where, qp)
        } catch (error) {
          return createQueryError(
            'Error in custom where clause',
            'CUSTOM_WHERE_ERROR',
            error
          )
        }
      }

      // Recherche full-text sécurisée avec support des relations complexes
      const searchParam = qp.get('search')
      if (searchParam && (searchFields.length || complexSearch?.relationFields)) {
        if (searchParam.length > 200) {
          return createQueryError(
            'Search term is too long',
            'SEARCH_TOO_LONG'
          )
        }
        
        const search = sanitizeSearchTerm(searchParam)
        if (search.length < 1) {
          return createQueryError(
            'Search term is too short after sanitization',
            'SEARCH_TOO_SHORT'
          )
        }

        const orConditions = buildComplexSearch(search, searchFields, complexSearch)
        
        // Si on a déjà des conditions dans where, on doit restructurer avec AND
        if (Object.keys(where).length > 0) {
          const existingConditions = { ...where }
          // Vider le where et reconstruire avec AND
          Object.keys(where).forEach(key => delete where[key])
          where.AND = [
            existingConditions,
            { OR: orConditions }
          ]
        } else {
          where.OR = orConditions
        }
      }

      // Préparer l'include de manière sécurisée
      const include: Record<string, any> = {}
      
      // Validation et limitation des comptages
      if (countFields.length) {
        if (countFields.length > 10) {
          return createQueryError(
            'Too many count fields requested',
            'TOO_MANY_COUNT_FIELDS'
          )
        }
        include._count = { select: {} }
        countFields.forEach(field => {
          include._count.select[field as string] = true
        })
      }
      
      // Validation et limitation des includes
      if (includeFields.length > 20) {
        return createQueryError(
          'Too many include fields requested',
          'TOO_MANY_INCLUDE_FIELDS'
        )
      }
      includeFields.forEach(field => {
        const fieldStr = field as string
        // Relations courantes avec select optimisé  
        if (fieldStr === 'tags' || fieldStr === 'specialites') {
          include[fieldStr] = {
            select: {
              id: true,
              libelle: true
            }
          }
        } else if (fieldStr === 'author') {
          include[fieldStr] = {
            select: {
              id: true,
              name: true
            }
          }
        } else {
          include[fieldStr] = true
        }
      })
      
      // Includes conditionnels
      Object.entries(conditionalIncludes).forEach(([key, config]) => {
        const paramValue = qp.get(config.param)
        const shouldInclude = config.value 
          ? paramValue === config.value 
          : paramValue === 'true'
        
        if (shouldInclude) {
          include[key] = config.include
        }
      })
      
      // Historique avec validation
      const historyParam = qp.get('history')
      if (historyRelation && historyParam === 'true') {
        include[historyRelation as string] = true
      }

      // Construction sécurisée des arguments pour findMany
      const findArgs: {
        where: WhereClause;
        orderBy?: Record<string, 'asc' | 'desc'>;
        skip: number;
        take: number;
        include?: Record<string, any>;
        select?: SelectField;
      } = {
        where,
        skip,
        take: limit,
      }
      
      if (sortBy) {
        findArgs.orderBy = { [sortBy as string]: sortOrder }
      }
      
      // Construction du select dynamique si baseSelect est fourni
      if (baseSelect) {
        const dynamicSelect = { ...baseSelect }
        
        // Ajouter les champs conditionnels
        Object.entries(conditionalFields).forEach(([field, config]) => {
          const paramValue = qp.get(config.param)
          const shouldInclude = config.value 
            ? paramValue === config.value 
            : paramValue === 'true'
          
          if (shouldInclude) {
            dynamicSelect[field] = true
          }
        })
        
        // Ajouter les relations du include au select
        Object.entries(include).forEach(([key, value]) => {
          dynamicSelect[key] = value
        })
        
        findArgs.select = dynamicSelect
      } else if (Object.keys(include).length) {
        findArgs.include = include
      }

      // Execution parallèle avec gestion d'erreurs
      const [total, data] = await Promise.all([
        model.count({ where }).catch(error => {
          console.error('[withQuery] Count query failed:', error)
          throw new Error('Failed to count records')
        }),
        model.findMany(findArgs).catch(error => {
          console.error('[withQuery] FindMany query failed:', error)
          throw new Error('Failed to fetch records')
        }),
      ])

      // Log d'audit pour les requêtes sensibles
      if (searchParam || Object.keys(where).length > 3) {
        console.log(`[withQuery] Query executed:`, {
          model: model.constructor.name,
          searchTerm: searchParam ? '***' : null,
          filtersCount: Object.keys(where).length,
          resultCount: data.length,
          timestamp: new Date().toISOString()
        })
      }

      const result = {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      }

      // Mise en cache du résultat
      if (cache.enabled) {
        const cacheKey = getCacheKey(cache.keyPrefix!, qp);
        setCache(cacheKey, result, cache.maxSize!);
      }

      return NextResponse.json(result)
      
    } catch (error) {
      console.error('[withQuery] Unexpected error:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to')) {
          return NextResponse.json({
            error: { message: error.message, code: 'DATABASE_ERROR' },
            timestamp: new Date().toISOString()
          }, { status: 500 })
        }
      }
      
      return NextResponse.json({
        error: { 
          message: 'Internal server error', 
          code: 'INTERNAL_ERROR'
        },
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
  }
}
