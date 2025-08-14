import { addSector } from "@/app/actions/sectors";
import Button from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FloatingLabelInput from "@/components/ui/input";
import { Sector } from "@/models/sector";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";

export default function AddSectors({ sector, onChange }: { sector: Sector, onChange: (state: any) => void }) {

    const [state, action, pending] = useActionState(addSector, undefined);
    const [libelle, setLibelle] = useState(sector.libelle);

    useEffect(() => {
        if (state === true) {
            onChange(state);
        }
    }, [state]);

    return (
        <>
            <DialogHeader className="text-slate-800">
                <DialogTitle className="text-slate-800 font-semibold">{sector.id ? "Modifier" : "Ajouter"}</DialogTitle>
                <DialogDescription>
                    {sector.id && sector.libelle}
                </DialogDescription>
            </DialogHeader>
            <form action={action} className='w-full'>
                <input type="text" name="id" value={sector.id} hidden />
                <FloatingLabelInput
                    className="w-full"
                    error={state && typeof state === 'object' && state.errors && state.errors.libelle ? state.errors.libelle.join(', ') : undefined}
                    label='Libellé' name="libelle" placeholder="Libellé"
                    value={libelle ?? ''} onChange={(e) => setLibelle(e.target.value)} />
                <DialogFooter>
                    <Button type="submit" variant={sector.id ? "success" : "primary"} className="mt-5" isLoading={pending} disabled={pending || !libelle}>{sector.id ? "Modifier" : "Ajouter"}</Button>
                </DialogFooter>
            </form>
        </>
    )
}