"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ReactNode, useCallback, useRef } from 'react';

interface AsyncBuilderProps<T> {
    promise: () => Promise<T>;
    hasData: (data: T, isRefreshing: boolean) => ReactNode;
    loadingComponent?: ReactNode;
    errorComponent?: (error: Error, retry: () => void) => ReactNode;
    emptyComponent?: ReactNode;
    callDataListen?: unknown;
    debounceMs?: number;
    enableRefresh?: boolean;
    onDataChange?: (data: T | null) => void;
    onError?: (error: Error) => void;
    onLoadingChange?: (loading: boolean) => void;
}

export function AsyncBuilder<T>({
    promise,
    hasData,
    loadingComponent = <div className="flex items-center justify-center p-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>,
    errorComponent,
    emptyComponent = <div className="text-center text-slate-500 p-4">Aucune donnée disponible.</div>,
    callDataListen,
    debounceMs = 300,
    enableRefresh = true,
    onDataChange,
    onError,
    onLoadingChange,
}: AsyncBuilderProps<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);
    const promiseRef = useRef(promise);

    const fetchData = useCallback(async (isRefresh = false) => {
        if (!mountedRef.current) return;
        
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setLoading(true);
        }
        
        setError(null);
        onLoadingChange?.(true);
        
        try {
            const result = await promiseRef.current();
            if (!mountedRef.current) return;
            
            setData(result);
            onDataChange?.(result);
        } catch (err: unknown) {
            if (!mountedRef.current) return;
            
            const error = err instanceof Error ? err : new Error('Unknown error');
            console.error('AsyncBuilder error:', error);
            setError(error);
            onError?.(error);
        } finally {
            if (!mountedRef.current) return;
            
            setLoading(false);
            setIsRefreshing(false);
            onLoadingChange?.(false);
        }
    }, [onDataChange, onError, onLoadingChange]); // Retirer 'promise' des dépendances

    const debouncedFetchData = useCallback(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        debounceRef.current = setTimeout(() => {
            fetchData(data !== null);
        }, debounceMs);
    }, [fetchData, debounceMs, data]);

    const retry = useCallback(() => {
        fetchData();
    }, [fetchData]);

    // Mettre à jour la référence de la promise
    useEffect(() => {
        promiseRef.current = promise;
    }, [promise]);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    // Effet pour le chargement initial
    useEffect(() => {
        fetchData();
    }, []); // Chargement une seule fois au montage

    // Effet pour les mises à jour basées sur callDataListen
    useEffect(() => {
        if (callDataListen !== undefined) {
            debouncedFetchData();
        }
    }, [callDataListen, debouncedFetchData]);

    if (loading && !isRefreshing) return loadingComponent;

    if (error && !data) {
        return errorComponent ? errorComponent(error, retry) : (
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

    return <>{hasData(data, isRefreshing)}</>;
}
