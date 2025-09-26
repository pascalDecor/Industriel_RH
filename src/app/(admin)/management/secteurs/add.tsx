import { addSector } from "@/app/actions/sectors";
import Button from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FloatingLabelInput from "@/components/ui/input";
import FloatingLabelTextarea from "@/components/ui/textarea";
import { Sector } from "@/models/sector";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";

export default function AddSectors({ sector, onChange }: { sector: Sector, onChange: (state: any) => void }) {

    const [state, action, pending] = useActionState(addSector, undefined);
    const [libelle, setLibelle] = useState(sector.libelle);
    const [libelle_en, setLibelle_en] = useState(sector.libelle_en || '');
    const [description, setDescription] = useState(sector.description || '');
    const [description_en, setDescription_en] = useState(sector.description_en || '');

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 border-b pb-1">Version Française</h3>
                        <FloatingLabelInput
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.libelle ? state.errors.libelle.join(', ') : undefined}
                            label='Libellé (FR)' name="libelle" placeholder="Libellé en français"
                            value={libelle ?? ''} onChange={(e) => setLibelle(e.target.value)} />
                        <FloatingLabelTextarea
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.description ? state.errors.description.join(', ') : undefined}
                            label='Description (FR)' name="description" placeholder="Description en français"
                            value={description ?? ''} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-700 border-b pb-1">Version Anglaise</h3>
                        <FloatingLabelInput
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.libelle_en ? state.errors.libelle_en.join(', ') : undefined}
                            label='Libellé (EN)' name="libelle_en" placeholder="Label in English"
                            value={libelle_en ?? ''} onChange={(e) => setLibelle_en(e.target.value)} />
                        <FloatingLabelTextarea
                            className="w-full"
                            error={state && typeof state === 'object' && state.errors && state.errors.description_en ? state.errors.description_en.join(', ') : undefined}
                            label='Description (EN)' name="description_en" placeholder="Description in English"
                            value={description_en ?? ''} onChange={(e) => setDescription_en(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" variant={sector.id ? "success" : "primary"} className="mt-5" isLoading={pending} disabled={pending || !libelle}>{sector.id ? "Modifier" : "Ajouter"}</Button>
                </DialogFooter>
            </form>
        </>
    )
}