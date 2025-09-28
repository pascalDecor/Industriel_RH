"use client";
import { useState, useEffect, ReactNode, useCallback, useRef, useMemo, useImperativeHandle, forwardRef } from "react";

interface AsyncBuilderProps<T> {
  promise: () => Promise<T>;
  hasData: (data: T, isRefreshing: boolean) => ReactNode; // doit idéalement être pure
  loadingComponent?: ReactNode;
  errorComponent?: (error: Error, retry: () => void) => ReactNode;
  emptyComponent?: ReactNode;
  callDataListen?: unknown;
  debounceMs?: number;
  enableRefresh?: boolean;
  refreshIntervalMs?: number;
  onDataChange?: (data: T | null) => void;
  onError?: (error: Error) => void;
  onLoadingChange?: (loading: boolean) => void;
  /** Nouveau : si true, on exécute hasData après le commit (dans un effet) */
  deferHasDataRender?: boolean;
  /** Si false, n'effectue pas l'appel automatique au montage */
  autoLoad?: boolean;
  /** Si false, n'effectue pas l'appel automatique quand callDataListen change */
  autoRefreshOnListen?: boolean;
  /** Si false, ne recharge pas quand la promise change (pour éviter les recharges intempestives) */
  autoRefreshOnPromiseChange?: boolean;
}

export interface AsyncBuilderRef {
  /** Déclenche manuellement un appel API */
  load: () => void;
  /** Déclenche manuellement un refresh */
  refresh: () => void;
  /** Accède aux données actuelles */
  getData: () => unknown;
  /** Accède au statut de chargement */
  isLoading: () => boolean;
}

export const AsyncBuilder = forwardRef<AsyncBuilderRef, AsyncBuilderProps<any>>(function AsyncBuilder<T>({
  promise,
  hasData,
  loadingComponent = (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
    </div>
  ),
  errorComponent,
  emptyComponent = <div className="text-center text-slate-500 p-4">Aucune donnée disponible.</div>,
  callDataListen,
  debounceMs = 300,
  enableRefresh = false,
  refreshIntervalMs = 30000, // 30 secondes par défaut
  onDataChange,
  onError,
  onLoadingChange,
  deferHasDataRender = true, // 👈 par défaut ON
  autoLoad = true, // 👈 par défaut ON pour la rétrocompatibilité
  autoRefreshOnListen = false, // 👈 DÉSACTIVÉ par défaut pour éviter les appels intempestifs
  autoRefreshOnPromiseChange = true, // 👈 par défaut ON pour la rétrocompatibilité
}: AsyncBuilderProps<T>, ref: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [deferredNode, setDeferredNode] = useState<ReactNode>(null); // 👈 pour l'option B

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);
  const promiseRef = useRef(promise);
  const initialLoadRef = useRef(false);
  const fetchDataRef = useRef<(isRefresh?: boolean) => Promise<void>>(async () => {});

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (!mountedRef.current) return;

      if (isRefresh) setIsRefreshing(true);
      else setLoading(true);

      setError(null);
      onLoadingChange?.(true);

      try {
        const result = await promiseRef.current();
        if (!mountedRef.current) return;

        setData(result);
        onDataChange?.(result);
      } catch (err: unknown) {
        if (!mountedRef.current) return;

        const e = err instanceof Error ? err : new Error("Unknown error");
        console.error("AsyncBuilder error:", e);
        setError(e);
        onError?.(e);
      } finally {
        if (!mountedRef.current) return;
        setLoading(false);
        setIsRefreshing(false);
        onLoadingChange?.(false);
      }
    },
    [onDataChange, onError, onLoadingChange]
  );

  // Garder fetchData dans une ref pour éviter les recreations d'interval
  // useEffect(() => {
  //   fetchDataRef.current = fetchData;
  // }, []);

  const debouncedFetchData = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData(data !== null);
    }, debounceMs);
  }, [fetchData, debounceMs, data]);

  const retry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Expose des méthodes via ref
  useImperativeHandle(ref, () => ({
    load: () => fetchData(),
    refresh: () => fetchData(true),
    getData: () => data,
    isLoading: () => loading || isRefreshing,
  }), [fetchData, data, loading, isRefreshing]);

  // Garder la dernière promise et refetch si elle change (si autoRefreshOnPromiseChange est activé)
  useEffect(() => {
    promiseRef.current = promise;
    // Si ce n'est pas le chargement initial et que autoRefreshOnPromiseChange est activé, refetch quand la promise change
    if (autoRefreshOnPromiseChange && initialLoadRef.current) {
      debouncedFetchData();
    }
  }, [promise, debouncedFetchData, autoRefreshOnPromiseChange]);

  // Mount / cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Chargement initial (seulement si autoLoad est activé)
  useEffect(() => {
    initialLoadRef.current = true;
    if (autoLoad) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad]);

  // Refresh sur callDataListen - actif seulement si autoRefreshOnListen est activé
  useEffect(() => {
    // Si callDataListen est défini, que ce n'est pas le chargement initial et que autoRefreshOnListen est activé
    if (autoRefreshOnListen && callDataListen !== undefined && callDataListen !== null && initialLoadRef.current) {
      debouncedFetchData();
    }
  }, [callDataListen, autoRefreshOnListen, debouncedFetchData]);

  // Refresh périodique - DÉSACTIVÉ TEMPORAIREMENT
  // useEffect(() => {
  //   if (enableRefresh && refreshIntervalMs > 0) {
  //     intervalRef.current = setInterval(() => {
  //       if (mountedRef.current && fetchDataRef.current) {
  //         fetchDataRef.current(true);
  //       }
  //     }, refreshIntervalMs);

  //     return () => {
  //       if (intervalRef.current) {
  //         clearInterval(intervalRef.current);
  //         intervalRef.current = null;
  //       }
  //     };
  //   } else {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   }
  // }, [enableRefresh, refreshIntervalMs]);

  // ✅ Option B : exécuter hasData APRÈS commit
  useEffect(() => {
    if (!deferHasDataRender) return;
    if (data) {
      // si hasData n’est pas pur et fait un setState, c’est OK ici
      setDeferredNode(hasData(data, isRefreshing));
    } else {
      setDeferredNode(null);
    }
  }, [data, isRefreshing, hasData, deferHasDataRender]);

  if (loading && !isRefreshing) return loadingComponent;

  if (error && !data) {
    return errorComponent ? (
      errorComponent(error, retry)
    ) : (
      <div className="text-center p-4">
        <div className="text-red-500 mb-2">Une erreur est survenue : {error.message}</div>
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!data) return emptyComponent;

  // Rendu final
  if (deferHasDataRender) {
    return <>{deferredNode}</>;
  }
  // Mode strict (Option A) : on appelle hasData pendant render → doit être PUR
  return <>{hasData(data, isRefreshing)}</>;
});
