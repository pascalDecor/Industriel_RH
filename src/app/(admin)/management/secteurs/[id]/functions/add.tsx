import { addFonction } from "@/app/actions/fonctions";
import Button from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FloatingLabelInput from "@/components/ui/input";
import { Fonction } from "@/models/fonction";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";

export default function AddFonctions({ fonction, sectorId, onChange }: { fonction: Fonction, sectorId: string, onChange: (state: boolean) => void }) {

    const [state, action, pending] = useActionState(addFonction, undefined);
    const [libelle, setLibelle] = useState(fonction.libelle);
    const [libelle_en, setLibelle_en] = useState(fonction.libelle_en);

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 border-b pb-1">Version Française</h3>
                        <FloatingLabelInput
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.libelle ? state.errors.libelle.join(', ') : undefined}
                            label='Libellé (FR)' name="libelle" placeholder="Libellé en français"
                            value={libelle ?? ''} onChange={(e) => setLibelle(e.target.value)} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 border-b pb-1">Version Anglaise</h3>
                        <FloatingLabelInput
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.libelle_en ? state.errors.libelle_en.join(', ') : undefined}
                            label='Libellé (EN)' name="libelle_en" placeholder="Label in English"
                            value={libelle_en ?? ''} onChange={(e) => setLibelle_en(e.target.value)} />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="submit" variant={fonction.id ? "success" : "primary"} className="mt-5" isLoading={pending} disabled={pending || !libelle}>{fonction.id ? "Modifier" : "Ajouter"}</Button>
                </DialogFooter>
            </form>
        </>
    )
}