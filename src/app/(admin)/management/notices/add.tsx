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
    const [author, setAuthor] = useState(notice.author);

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
                <FloatingLabelTextarea
                    className="w-full mb-10"
                    error={state && typeof state === 'object' && state.errors && state.errors.content ? state.errors.content.join(', ') : undefined}
                    label='Contenu' name="content" placeholder="Contenu"
                    value={content ?? ''} onChange={(e) => setContent(e.target.value)} />
                <FloatingLabelInput
                    className="w-full"
                    error={state && typeof state === 'object' && state.errors && state.errors.author ? state.errors.author.join(', ') : undefined}
                    label='Auteur' name="author" placeholder="Auteur"
                    value={author ?? ''} onChange={(e) => setAuthor(e.target.value)} />

                <input type="text" name="stars" value={JSON.stringify(star)} hidden className="w-full" />

                <div className="flex mt-5 gap-2 px-3">
                    {stars.map((s, i) =>
                        <AiFillStar key={i} className={
                            clsx("text-slate-300 text-xl cursor-pointer",
                                star >= s && "text-yellow-500")} onClick={() => setStar(s)} />
                    )}
                </div>

                <InputError messages={state && typeof state === 'object' && state.errors && state.errors.stars ? state.errors.stars : []} inputName="stars" />

                <DialogFooter>
                    <Button type="submit" variant={notice.id ? "success" : "primary"} className="mt-5" isLoading={pending} disabled={pending || !author}>{notice.id ? "Modifier" : "Ajouter"}</Button>
                </DialogFooter>
            </form>
        </>
    )
}