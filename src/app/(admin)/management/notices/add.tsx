import { addNotice } from "@/app/actions/notices";
import Button from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FloatingLabelInput from "@/components/ui/input";
import InputError from "@/components/ui/inputError";
import FloatingLabelTextarea from "@/components/ui/textarea";
import { Notice } from "@/models/notice";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { useActionState, useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";

export default function AddNotices({ notice, onChange }: { notice: Notice, onChange: (state: any) => void }) {

    const [state, action, pending] = useActionState(addNotice, undefined);
    const [content, setContent] = useState(notice.content);
    const [contentEn, setContentEn] = useState(notice.content_en || '');
    const [author, setAuthor] = useState(notice.author);
    const [authorEn, setAuthorEn] = useState(notice.author_en || '');

    const [star, setStar] = useState( notice.stars || 0);

    const stars = [1, 2, 3, 4, 5];

    useEffect(() => {
        if (state === true) {
            onChange(state);
        }
    }, [state]);

    return (
        <>
            <DialogHeader className="text-slate-800">
                <DialogTitle className="text-slate-800 font-semibold">{notice.id ? "Modifier" : "Ajouter"}</DialogTitle>
                <DialogDescription>
                    {notice.id && notice.author}
                </DialogDescription>
            </DialogHeader>
            <form action={action} className='w-full'>
                <input type="text" name="id" value={notice.id} hidden />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 border-b pb-1">Version Française</h3>
                        <FloatingLabelTextarea
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.content ? state.errors.content.join(', ') : undefined}
                            label='Contenu (FR)' name="content" placeholder="Contenu en français"
                            value={content ?? ''} onChange={(e) => setContent(e.target.value)} />
                        <FloatingLabelInput
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.author ? state.errors.author.join(', ') : undefined}
                            label='Auteur (FR)' name="author" placeholder="Auteur en français"
                            value={author ?? ''} onChange={(e) => setAuthor(e.target.value)} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 border-b pb-1">Version Anglaise</h3>
                        <FloatingLabelTextarea
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.content_en ? state.errors.content_en.join(', ') : undefined}
                            label='Contenu (EN)' name="content_en" placeholder="Content in English"
                            value={contentEn ?? ''} onChange={(e) => setContentEn(e.target.value)} />
                        <FloatingLabelInput
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.author_en ? state.errors.author_en.join(', ') : undefined}
                            label='Auteur (EN)' name="author_en" placeholder="Author in English"
                            value={authorEn ?? ''} onChange={(e) => setAuthorEn(e.target.value)} />
                    </div>
                </div>

                <input type="text" name="stars" value={JSON.stringify(star)} hidden className="w-full" />

                <div className="flex mt-5 gap-2 px-3">
                    {stars.map((s, i) =>
                        <AiFillStar key={i} className={
                            clsx("text-slate-300 text-xl cursor-pointer",
                                star >= s && "text-yellow-500")} onClick={() => setStar(s)} />
                    )}
                </div>

                {(state) && <InputError messages={state && typeof state === 'object' && state.errors && state.errors.stars ? state.errors.stars : []} inputName="stars" />}

                <DialogFooter>
                    <Button type="submit" variant={notice.id ? "success" : "primary"} className="mt-5" isLoading={pending} disabled={pending || !author}>{notice.id ? "Modifier" : "Ajouter"}</Button>
                </DialogFooter>
            </form>
        </>
    )
}