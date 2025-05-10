import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Article } from "@/models/article";
import EditorContent from "@/components/ui/editorContent";
import Image from "next/image";
import clsx from "clsx";

export default function ItemArticles({ article, onChange, className = "col-span-3 md:col-span-2 lg:col-span-1" }: { article: Article, onChange: (state: any) => void, className?: string }) {
    return (
        <Card key={article.id} className={clsx("relative p-3 lg:p-5 shadow-none hover:shadow-xl cursor-pointer border-none mb-5", className)}>
            <div className="relative w-full h-60 rounded-lg overflow-hidden">
                <Image src={article.image} width={100} height={100} className="rounded-lg w-full h-full blur-[1.5px] absolute left-0 top-0" alt="Salary Guide" />
                <Image src={article.image} width={100} height={100} className="mx-auto w-auto h-full blur-[0px]" alt="Salary Guide" />
            </div>
            <h3 className="font-bold my-0">{article.titre}</h3>
            <p className="text-slate-700 text-sm -mt-3 line-clamp-3 my-2">
                {article.specialites.map((specialite) => (
                    <span key={specialite.id} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-xl mx-0.5">
                        {specialite.libelle}
                    </span>
                ))}
            </p>
            <p className="text-slate-700 text-sm -mt-5 line-clamp-3">
                <EditorContent content={article.contenu} />
            </p>
            <p className="text-slate-700 text-sm -mt-3 line-clamp-3 mb-10 ">
                {article.tags.map((tag) => (
                    <span key={tag.id} className="px-2 text-blue-800">
                        #{tag.libelle}
                    </span>
                ))}
            </p>
            <div className="flex justify-between items-center w-full pl-10 float-end absolute lg:bottom-5 lg:right-5 bottom-3 right-3">
                <p className="text-slate-700 mt-0 font-semibold">
                    {article.views} vues
                </p>
                <p className="text-slate-700 mt-0 text-sm">
                    Publié le {formatDateFr(article.createdAt)}
                </p>
            </div>
        </Card>
    )
}