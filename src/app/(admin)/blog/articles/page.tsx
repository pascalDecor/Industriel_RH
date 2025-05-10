
"use client";

import { LoadingSpinner } from "@/lib/load.helper";
import { Article } from "@/models/article";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import Button from "@/components/ui/button";
import { redirect } from "next/navigation";
import { AsyncBuilder } from "@/components/ui/asyncBuilder";
import ItemArticles from "./item";
import Pagination from "@/components/paginationCustom";
import FloatingLabelInput from "@/components/ui/input";

export default function Blog() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    let [changeCount, setchangeCount] = useState(0);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Articles</h2>
                <div className="flex items-center justify-end space-x-2 ">
                    <FloatingLabelInput
                        className="!w-[200px]"
                        label='Rechercher un article' name="search" placeholder="Rechercher un article"
                        value={search ?? ''} onChange={(e) => { setSearch(e.target.value); setchangeCount(c => c + 1); }} />
                    <Button className="w-full py-3" onClick={() => redirect('/blog/articles/add')}>Ajouter un article</Button>
                </div>
            </div>
            {/* Liste des articles */}

            <AsyncBuilder promise={async () => {
                return HttpService.index<Article>({
                    url: '/articles?page=' + page + '&search=' + search,
                    fromJson: (json: any) => Article.fromJSON(json)
                });
            }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>} callDataListen={changeCount} hasData={data => {
                setPage(data.meta.page);
                return <>
                    {search && data.data.length === 0 && <div className="text-center text-slate-500 font-bold bg-white rounded-lg p-10">Aucun résultat !</div>}
                    {data.data.length !== 0 && <p className="text-slate-700 text-sm mb-4 font-semibold">{data.meta.total} résultats</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
                        {data.data.map(s =>
                            <ItemArticles key={s.id} article={s} onChange={state => {
                                if (state) {
                                    setchangeCount(c => c + 1);
                                }
                            }} />
                        )}
                    </div>
                    {(data.data.length !== 0 && data.meta.totalPages > 1) && <div className="flex justify-center w-full">
                        <Pagination className="my-5 mx-auto" currentPage={page} totalPages={data.meta.totalPages} onPageChange={newPage => {
                            setPage(newPage);
                            setchangeCount(c => c + 1);
                        }} siblingCount={1} // optionnel, nombre de pages voisines
                        />
                    </div>}
                </>;
            }} />
        </div>
    );
}