import { addTag } from "@/app/actions/tags";
import Button from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FloatingLabelInput from "@/components/ui/input";
import { Tag } from "@/models/tag";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";

export default function AddTags({ tag, onChange }: { tag: Tag, onChange: (state: any) => void }) {

    const [state, action, pending] = useActionState(addTag, undefined);
    const [libelle, setLibelle] = useState(tag.libelle);
    const [libelle_en, setLibelle_en] = useState(tag.libelle_en);

    useEffect(() => {
        if (state === true) {
            onChange(state);
        }
    }, [state]);

    return (
        <>
            <DialogHeader className="text-slate-800">
                <DialogTitle className="text-slate-800 font-semibold">{tag.id ? "Modifier" : "Ajouter"}</DialogTitle>
                <DialogDescription>
                    {tag.id && tag.libelle}
                </DialogDescription>
            </DialogHeader>
            <form action={action} className='w-full space-y-3 mt-5'>
                <input type="text" name="id" value={tag.id} hidden />
                <FloatingLabelInput
                    className="w-full"
                    error={state && typeof state === 'object' && state.errors && state.errors.libelle ? state.errors.libelle.join(', ') : undefined}
                    label='Libellé' name="libelle" placeholder="Libellé"
                    value={libelle ?? ''} onChange={(e) => setLibelle(e.target.value)} />

                <FloatingLabelInput
                    className="w-full"
                    error={state && typeof state === 'object' && state.errors && state.errors.libelle_en ? state.errors.libelle_en.join(', ') : undefined}
                    label='Libellé en anglais' name="libelle_en" placeholder="Libellé en anglais"
                    value={libelle_en ?? ''} onChange={(e) => setLibelle_en(e.target.value)} />
                <DialogFooter>
                    <Button type="submit" variant={tag.id ? "success" : "primary"} className="mt-5" isLoading={pending} disabled={pending || !libelle}>{tag.id ? "Modifier" : "Ajouter"}</Button>
                </DialogFooter>
            </form>
        </>
    )
}