
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OngletProps {
    id: "published" | "unpublished";
    libelle: string;
}

export default function Blog() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [changeCount, setchangeCount] = useState(0);

    const onglets: OngletProps[] = [
        {
            id: "published",
            libelle: "Publiés"
        },
        {
            id: "unpublished",
            libelle: "Non publiés"
        }
    ];

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

            <div>
                <Tabs defaultValue={onglets[0].id} className="w-full">
                    <div className="bg-slate-200 py-0 px-0 w-full rounded-xl">
                        <TabsList className="w-fit px-0 py-5 bg-slate-200">
                            {onglets.map(onglet =>
                                <TabsTrigger
                                    key={onglet.id}
                                    className="py-5 px-10 cursor-pointer w-fit"
                                    value={onglet.id}>{onglet.libelle}</TabsTrigger>)}
                        </TabsList>
                    </div>
                    {onglets.map(onglet =>
                        <TabsContent key={onglet.id} value={onglet.id}>
                            <AsyncBuilder promise={async () => {
                                const publishedParam = onglet.id === "published" ? "true" : "false";
                                return HttpService.index<Article>({
                                    url: `/articles?page=${page}&search=${search}&published=${publishedParam}&includeContent=true`,
                                    fromJson: (json: any) => Article.fromJSON(json)
                                });
                            }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>} callDataListen={changeCount} autoRefreshOnListen={true} onDataChange={(data) => {
                                if (data) {
                                    setPage(data.meta.page);
                                }
                            }} hasData={data => {
                                return <>
                                    {search && data.data.length === 0 && <div className="text-center text-slate-500 font-bold bg-white rounded-lg p-10">Aucun résultat !</div>}
                                    {data.data.length !== 0 && <p className="text-slate-700 text-sm mt-2 mb-2 ml-2 font-semibold">{data.meta.total} résultats</p>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
                                        {data.data.map((s: any) =>
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
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    );
}