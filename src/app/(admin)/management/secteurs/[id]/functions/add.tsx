import { addFonction } from "@/app/actions/fonctions";
import Button from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FloatingLabelInput from "@/components/ui/input";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";

export default function AddFonctions({ fonction,sectorId, onChange }: { fonction: any, sectorId: string, onChange: (state: boolean) => void }) {

    const [state, action, pending] = useActionState(addFonction, undefined);
    const [libelle, setLibelle] = useState(fonction.libelle);

    useEffect(() => {
        if (state === true) {
            onChange(state);
        }
    }, [state]);

    return (
        <>
            <DialogHeader className="text-slate-800">
                <DialogTitle className="text-slate-800 font-semibold">{fonction.id ? "Modifier" : "Ajouter"}</DialogTitle>
                <DialogDescription>
                    {fonction.id && fonction.libelle}
                </DialogDescription>
            </DialogHeader>
            <form action={action} className='w-full'>
                <input type="text" name="id" value={fonction.id} hidden />
                <input type="text" name="sectorId" value={sectorId} hidden />
                <FloatingLabelInput
                    className="w-full"
                    error={state && typeof state === 'object' && state.errors && state.errors.libelle ? state.errors.libelle.join(', ') : undefined}
                    label='Libellé' name="libelle" placeholder="Libellé"
                    value={libelle ?? ''} onChange={(e) => setLibelle(e.target.value)} />
                <DialogFooter>
                    <Button type="submit" variant={fonction.id ? "success" : "primary"} className="mt-5" isLoading={pending} disabled={pending || !libelle}>{fonction.id ? "Modifier" : "Ajouter"}</Button>
                </DialogFooter>
            </form>
        </>
    )
}