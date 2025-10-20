"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder"
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/lib/load.helper"
import { Application } from "@/models/application"
import { HttpService } from "@/utils/http.services"

import ItemCandidatures from "./item";
import { useState, useCallback } from "react";
import Pagination from "@/components/paginationCustom";



export default function ListeCandidatures({state, search} : Readonly<{state: string, search: string}>) {
    const [changeCount, setchangeCount] = useState(0);
    const [page, setPage] = useState(1);

    // ✅ Mémoriser la promise pour éviter les rechargements continus
    const fetchApplications = useCallback(async () => {
        return await HttpService.index<Application>({
            url: '/applications?page=' + page + '&search=' + search + '&state=' + state,
            fromJson: (json: any) => Application.fromJSON(json)
        });
    }, [page, search, state]);

    return (
     <div className="py-5">
                <AsyncBuilder
                    promise={fetchApplications}
                    loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                    callDataListen={changeCount}
                    autoRefreshOnListen={true}
                    autoRefreshOnPromiseChange={false}
                    onDataChange={(data) => {
                        if (data) {
                            setPage(data.meta.page);
                        }
                    }}
                    hasData={(data) => {
                        return <>
                            {search && data.data.length === 0 && <div className="text-center text-slate-500 font-bold bg-white rounded-lg p-10">Aucun résultat !</div>}
                            {(data.data.length !== 0 && search) && <p className="text-slate-700 text-sm mb-4 font-semibold">{data.meta.total} résultats</p>}
                            {data.data.map((s: any) =>
                                <ItemCandidatures key={s.id} candidature={s} onChange={(state) => {
                                    if (state) {
                                        setchangeCount(c => c + 1);
                                    }
                                }}
                                />)}
                            {(data.data.length !== 0 && data.meta.totalPages > 1) && <div>
                                <Pagination className="my-5 mx-auto" currentPage={page} totalPages={data.meta.totalPages} onPageChange={newPage => {
                                    setPage(newPage);
                                    setchangeCount(c => c + 1);
                                }} siblingCount={1} // optionnel, nombre de pages voisines
                                />
                            </div>}
                        </>
                    }
                    }
                />
            </div>
    )
}
