"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder"
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/lib/load.helper"
import { Tag } from "@/models/tag"
import { HttpService } from "@/utils/http.services"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddTags from "./add";
import ItemTags from "./item";
import { useState } from "react";
import Pagination from "@/components/paginationCustom";
import FloatingLabelInput from "@/components/ui/input";

export default function Tags() {
    const [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [isEnglishView, setIsEnglishView] = useState(false);

    return (
        <div className="space-y-4">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tags</h2>
                    <p className="text-slate-700 text-sm">Page de gestion des tags</p>
                </div>
                <div className="flex items-center justify-end space-x-2">

                    <div className="flex items-center justify-end">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                            <span className="text-sm text-gray-600">Version:</span>
                            <button
                                onClick={() => setIsEnglishView(false)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${!isEnglishView
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Français
                            </button>
                            <button
                                onClick={() => setIsEnglishView(true)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${isEnglishView
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                English
                            </button>
                        </div>
                    </div>

                    <FloatingLabelInput
                        className="!w-[200px]"
                        label='Rechercher un tag' name="search" placeholder="Rechercher un tag"
                        value={search ?? ''} onChange={(e) => { setSearch(e.target.value); setchangeCount(c => c + 1); }} />
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild={true}>
                            <Button className="w-full py-3">Ajouter un tag</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <AddTags tag={Tag.fromJSON(({} as any))} onChange={state => {
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
                    return HttpService.index<Tag>({
                        url: '/tags?page=' + page + '&search=' + search,
                        fromJson: (json: any) => Tag.fromJSON(json)
                    });
                }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                    callDataListen={changeCount}
                    enableRefresh={true}
                    hasData={(data) => {
                        setPage(data.meta.page);
                        return <>
                            {search && data.data.length === 0 && <div className="text-center text-slate-500 font-bold bg-white rounded-lg p-10">Aucun résultat !</div>}
                            {data.data.length !== 0 && <p className="text-slate-700 text-sm mb-4 font-semibold">{data.meta.total} résultats</p>}
                            {data.data.map((t: any) =>
                                <ItemTags key={t.id} tag={t} isEnglishView={isEnglishView} onChange={(state) => {
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