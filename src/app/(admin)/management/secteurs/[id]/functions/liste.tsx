"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder"
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/lib/load.helper"
import { HttpService } from "@/utils/http.services"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddFonctions from "./add";
import ItemFonctions from "./item";
import { useState } from "react";
import Pagination from "@/components/paginationCustom";
import FloatingLabelInput from "@/components/ui/input";
import { Fonction } from "@/models/fonction";

export default function FonctionsListe({ sectorId }: Readonly<{ sectorId: string }>) {
    let [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    return (
        <div className="space-y-4">

            <div className="flex items-center justify-between">
                <div>
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <FloatingLabelInput
                        className="!w-[200px]"
                        label='Rechercher une fonction' name="search" placeholder="Rechercher une fonction"
                        value={search ?? ''} onChange={(e) => { setSearch(e.target.value); setchangeCount(c => c + 1); }} />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild={true}>
                            <Button className="w-full py-3">Ajouter une fonction</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <AddFonctions sectorId={sectorId} fonction={Fonction.fromJSON(({} as any))} onChange={state => {
                                if (state) {
                                    setchangeCount(c => c + 1);
                                    setOpen(false);
                                }
                            }} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div>
                <AsyncBuilder promise={async () => {
                    return HttpService.index<Fonction>({
                        url: '/fonctions?page=' + page + '&search=' + search + '&sectorId=' + sectorId,
                        fromJson: (json: any) => Fonction.fromJSON(json)
                    });
                }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                    callDataListen={changeCount}
                    hasData={(data) => {
                        setPage(data.meta.page);
                        return <>
                            {search && data.data.length === 0 && <div className="text-center text-slate-500 font-bold bg-white rounded-lg p-10">Aucun résultat !</div>}
                            {data.data.length !== 0 && <p className="text-slate-700 text-sm mb-4 font-semibold">{data.meta.total} résultats</p>}
                            {data.data.map(s =>
                                <ItemFonctions key={s.id} fonction={s} onChange={(state) => {
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
                        </>
                    }
                    }
                />
            </div>

        </div>
    )
}
