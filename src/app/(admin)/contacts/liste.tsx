"use client";

import { LoadingSpinner } from "@/lib/load.helper"
import { useContacts } from "@/hooks/useContacts";
import ItemContacts from "./item";
import { useState } from "react";
import Pagination from "@/components/paginationCustom";

export default function ListeContacts({ state, search }: Readonly<{ state: string, search: string }>) {
    const [page, setPage] = useState(1);
    
    const { data, isLoading, error, refetch } = useContacts({ 
        page, 
        search, 
        status: state 
    });

    if (isLoading && !data) {
        return (
            <div className="py-5">
                <LoadingSpinner color="#0F766E" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-5">
                <div className="text-center text-red-500 font-bold bg-white rounded-lg p-10">
                    Erreur lors du chargement des contacts
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="py-5">
            {/* Indicateur de chargement en arrière-plan */}
            {isLoading && data && (
                <div className="mb-2 text-xs text-blue-600 text-center opacity-75">
                    Actualisation en cours...
                </div>
            )}
            
            {search && data.data.length === 0 && (
                <div className="text-center text-slate-500 font-bold bg-white rounded-lg p-10">
                    Aucun résultat !
                </div>
            )}
            
            {(data.data.length !== 0 && search) && (
                <p className="text-slate-700 text-sm mb-4 font-semibold">
                    {data.meta.total} résultats
                </p>
            )}
            
            <div>
                {data.data.map(contact =>
                    <ItemContacts 
                        key={contact.id} 
                        contact={contact} 
                        onChange={(shouldRefetch) => {
                            if (shouldRefetch) {
                                refetch();
                            }
                        }}
                    />
                )}
            </div>
            
            {(data.data.length !== 0 && data.meta.totalPages > 1) && (
                <div>
                    <Pagination 
                        className="my-5 mx-auto" 
                        currentPage={page} 
                        totalPages={data.meta.totalPages} 
                        onPageChange={newPage => {
                            setPage(newPage);
                        }} 
                        siblingCount={1}
                    />
                </div>
            )}
        </div>
    )
}
