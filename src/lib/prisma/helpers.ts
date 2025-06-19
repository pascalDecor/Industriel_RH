import { NextResponse } from 'next/server'

export interface QueryOptions<T> {
  // Recherche full-text
  searchFields?: (keyof T)[]                           
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
  // Soft-delete / archivage
  archivedField?: keyof T | string        
  defaultArchived?: boolean      
  // Activation / désactivation
  activeField?: keyof T          
  defaultActive?: boolean        
  // Historique / révisions
  historyRelation?: keyof T      
}

export function withQuery<T, M extends {
  count(args: any): Promise<number>
  findMany(args: any): Promise<T[]>
}>(model: M, opts: QueryOptions<T>) {
  const {
    searchFields = [],
    sortFields = [],
    defaultSortBy,
    defaultSortOrder = 'asc',
    maxLimit = 100,
    filterFields = {},
    modifyWhere,
    countFields = [],
    includeFields = [],
    archivedField,
    defaultArchived = false,
    activeField,
    defaultActive = true,
    historyRelation,
  } = opts

  return async function GET(req: Request) {
    const url = new URL(req.url)
    const qp = url.searchParams

    // Pagination
    const page  = Math.max(1, parseInt(qp.get('page')  || '1', 10))
    const limit = Math.min(maxLimit, parseInt(qp.get('limit') || '10', 10))
    const skip  = (page - 1) * limit

    // Tri contrôlé
    let sortBy = (qp.get('sortBy') as keyof T) || defaultSortBy!
    const sortOrder = qp.get('sortOrder') === 'desc' ? 'desc' : defaultSortOrder
    if (sortFields.length > 0 && sortBy && !sortFields.includes(sortBy)) {
      sortBy = defaultSortBy!
    }

    // Construction du where
    const where: any = {}

    // Archivage
    if (archivedField) {
      const archParam = qp.get('archived')
      where[archivedField as string] =
        archParam != null
          ? archParam === 'true'
          : defaultArchived
    }

    // Activation
    if (activeField) {
      const actParam = qp.get('active')
      where[activeField as string] =
        actParam != null
          ? actParam === 'true'
          : defaultActive
    }

    // Filtres scalaires simples
    Object.entries(filterFields).forEach(([param, field]) => {
      const val = qp.get(param)
      if (val != null) {
        where[field as string] = val
      }
    })

    // Filtres relationnels
    if (modifyWhere) modifyWhere(where, qp)

    // Recherche full-text
    const search = qp.get('search')?.trim()
    if (search && searchFields.length) {
      where.OR = searchFields.map(field => ({
        [field as string]: { contains: search, mode: 'insensitive' }
      }))
    }

    // Préparer l'include pour counts, includes et historique
    const include: any = {}
    // Comptages
    if (countFields.length) {
      include._count = { select: {} }
      countFields.forEach(field => {
        include._count.select[field as string] = true
      })
    }
    // Include relations simples
    includeFields.forEach(field => {
      include[field as string] = true
    })
    // Historique
    if (historyRelation && qp.get('history') === 'true') {
      include[historyRelation as string] = true
    }

    // Construction des arguments pour findMany
    const findArgs: any = {
      where,
      orderBy: sortBy ? { [sortBy as string]: sortOrder } : undefined,
      skip,
      take: limit,
    }
    if (Object.keys(include).length) {
      findArgs.include = include
    }

    // Execution parallèle
    const [ total, data ] = await Promise.all([
      model.count({ where }),
      model.findMany(findArgs),
    ])

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  }
}
