"use client";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ReactNode } from 'react';

interface AsyncBuilderProps<T> {
    promise: () => Promise<T>;
    hasData: (data: T) => ReactNode;
    loadingComponent?: ReactNode;
    errorComponent?: (error: Error, retry: () => void) => ReactNode;
    callDataListen?: any; // pour permettre un refetch par clé
}

export function AsyncBuilder<T>({
    promise,
    hasData,
    loadingComponent = <div>Chargement en cours...</div>,
    errorComponent,
    callDataListen,
}: AsyncBuilderProps<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await promise();
            setData(result);
        } catch (err: any) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [callDataListen]);

    if (loading) return loadingComponent;

    if (error)
        return errorComponent ? errorComponent(error, fetchData) : (
            <div className="text-red-500">Une erreur est survenue : {error.message}</div>
        );

    if (!data) return <div>Aucune donnée disponible.</div>;

    return <>{hasData(data)}</>;
}
