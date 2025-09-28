"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder"
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/lib/load.helper"
import { Notice } from "@/models/notice"
import { HttpService } from "@/utils/http.services"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddNotices from "./add";
import ItemNotices from "./item";
import { useState } from "react";
import Pagination from "@/components/paginationCustom";
import FloatingLabelInput from "@/components/ui/input";
import { redirect } from "next/navigation";


export default function Notices() {
    const [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [active, setActive] = useState<Notice | undefined>(undefined);
    return (
        <div className="space-y-4">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Avis</h2>
                    <p className="text-slate-700 text-sm">Page de gestion des avis</p>
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <FloatingLabelInput
                        className="!w-[200px]"
                        label='Rechercher un avis' name="search" placeholder="Rechercher un avis"
                        value={search ?? ''} onChange={(e) => { setSearch(e.target.value); setchangeCount(c => c + 1); }} />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild={true}>
                            <Button className="w-full py-3">Ajouter un avis</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <AddNotices notice={Notice.fromJSON(({} as any))} onChange={state => {
                                if (state) {
                                    setchangeCount(c => c + 1);
                                    setOpen(false);
                                }
                            }} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AsyncBuilder promise={async () => {
                    return HttpService.index<Notice>({
                        url: '/notices?page=' + page + '&search=' + search + '&_t=' + changeCount,
                        fromJson: (json: any) => Notice.fromJSON(json)
                    });
                }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                    callDataListen={changeCount}
                    enableRefresh={false}

                    hasData={(data) => {
                        setPage(data.meta.page);
                        return <div className={active ? "col-span-2" : "col-span-2"}>
                            {search && data.data.length === 0 && <div className="text-center text-slate-500 font-bold bg-white rounded-lg p-10">Aucun résultat !</div>}
                            {data.data.length !== 0 && <p className="text-slate-700 text-sm mb-4 font-semibold">{data.meta.total} résultats</p>}
                            {data.data.map((s: any) =>
                                <ItemNotices key={s.id} notice={s} onChange={(state) => {
                                    if (state) {
                                        setchangeCount(c => c + 1);
                                        setOpen(false);
                                    }
                                }}
                                />)}
                            {(data.data.length !== 0 && data.meta.totalPages > 1) && <div className="flex justify-center w-full">
                                <Pagination className="my-5 mx-auto" currentPage={page} totalPages={data.meta.totalPages} onPageChange={newPage => {
                                    setPage(newPage);
                                    setchangeCount(c => c + 1);
                                }} siblingCount={1} // optionnel, nombre de pages voisines
                                />
                            </div>}
                        </div>
                    }
                    }
                />

            </div>

        </div>
    )
}
