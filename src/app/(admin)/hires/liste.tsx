"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder"
import { LoadingSpinner } from "@/lib/load.helper"
import { Hire } from "@/models/hire"
import { HttpService } from "@/utils/http.services"

import ItemHires from "./item";
import { useState } from "react";
import Pagination from "@/components/paginationCustom";
import { redirect } from "next/navigation";



export default function ListeHires({ state, search }: Readonly<{ state: string, search: string }>) {
    let [changeCount, setchangeCount] = useState(0);
    const [page, setPage] = useState(1);
    return (
        <div className="py-5">
            <AsyncBuilder promise={async () => {
                return await HttpService.index<Hire>({
                    url: '/hires?page=' + page + '&search=' + search + '&state=' + state,
                    fromJson: (json: any) => Hire.fromJSON(json)
                });
            }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                callDataListen={changeCount}
                hasData={(data) => {
                    setPage(data.meta.page);
                    return <>
                        {search && data.data.length === 0 && <div className="text-center text-slate-500 font-bold bg-white rounded-lg p-10">Aucun résultat !</div>}
                        {(data.data.length !== 0 && search) && <p className="text-slate-700 text-sm mb-4 font-semibold">{data.meta.total} résultats</p>}
                        {data.data.map(s =>
                            <ItemHires key={s.id} hire={s} onChange={(state) => {
                                if (state) {
                                    setchangeCount(c => c + 1);
                                }
                            }}
                                onActive={(hire) => {
                                    console.log("hire", hire);
                                    redirect('/hires/' + hire.id);
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
