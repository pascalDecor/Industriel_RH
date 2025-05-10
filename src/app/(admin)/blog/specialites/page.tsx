"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder"
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/lib/load.helper"
import { Specialite } from "@/models/specialite"
import { HttpService } from "@/utils/http.services"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddSpecialites from "./add";
import ItemSpecialites from "./item";
import { useState } from "react";
import Pagination from "@/components/paginationCustom";
import FloatingLabelInput from "@/components/ui/input";

export default function Specialites() {
    let [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    return (
        <div className="space-y-4">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Spécialités</h2>
                    <p className="text-slate-700 text-sm">Page de gestion des spécialités</p>
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <FloatingLabelInput
                        className="!w-[200px]"
                        label='Rechercher une spécialité' name="search" placeholder="Rechercher une spécialité"
                        value={search ?? ''} onChange={(e) => { setSearch(e.target.value); setchangeCount(c => c + 1); }} />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild={true}>
                            <Button className="w-full py-3">Ajouter une spécialité</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <AddSpecialites specialite={Specialite.fromJSON(({} as any))} onChange={state => {
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
                    return HttpService.index<Specialite>({
                        url: '/specialites?page=' + page + '&search=' + search,
                        fromJson: (json: any) => Specialite.fromJSON(json)
                    });
                }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                    callDataListen={changeCount}
                    hasData={(data) => {
                        setPage(data.meta.page);
                        return <>
                            {search && data.data.length === 0 && <div className="text-center text-slate-500 font-bold bg-white rounded-lg p-10">Aucun résultat !</div>}
                            {data.data.length !== 0 && <p className="text-slate-700 text-sm mb-4 font-semibold">{data.meta.total} résultats</p>}
                            {data.data.map(s =>
                                <ItemSpecialites key={s.id} specialite={s} onChange={(state) => {
                                    if (state) {
                                        setchangeCount(c => c + 1);
                                        setOpen(false);
                                    }
                                }}
                                />)}
                            {data.data.length !== 0 && <div className="flex justify-center w-full">
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
