
"use client";

import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/lib/load.helper";
import { Article } from "@/models/article";
import { HttpService } from "@/utils/http.services";
import { useEffect, useState } from "react";
import Image from 'next/image';
import Button from "@/components/ui/button";
import { formatDateFr } from "@/lib/formatDate";
import { redirect } from "next/navigation";
import EditorContent from "@/components/ui/editorContent";

export default function Blog() {

    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log("useEffect", articles);
        const fetchData = async () => {
            const articles = await HttpService.index<Article>({
                url: "/articles",
                fromJson: (json: any) => Article.fromJSON(json),

            });
            setArticles(articles);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Articles</h2>
                <Button onClick={() => redirect('/blog/articles/add')}>Ajouter un article</Button>
            </div>

            {loading ? (
                <LoadingSpinner color="#0F766E"></LoadingSpinner>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
                    {articles.map((article: Article) => (
                        <Card key={article.id} className="p-3 lg:p-5 shadow-none hover:shadow-xl cursor-pointer border-none  col-span-3 md:col-span-2 lg:col-span-1 mb-5">
                            <div className="relative w-full h-60 rounded-lg overflow-hidden">
                                <Image src={article.image} width={100} height={100} className="rounded-lg w-full h-full blur-[1.5px] absolute left-0 top-0" alt="Salary Guide" />
                                <Image src={article.image}  width={100} height={100} className="mx-auto w-auto h-full blur-[0px]" alt="Salary Guide" />
                            </div>
                            <h3 className="font-bold my-0">{article.titre}</h3>
                            <p className="text-slate-700 text-sm -mt-5 line-clamp-3">
                                <EditorContent content={article.contenu} />
                            </p>
                            <div className="flex justify-between items-center float-end">

                                <p className="text-slate-700 mt-0 font-semibold">
                                    {article.views} vues
                                </p>
                                <p className="text-slate-700 mt-0 text-sm">
                                    Publié le {formatDateFr(article.createdAt)}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

            )}
        </div>
    );
}