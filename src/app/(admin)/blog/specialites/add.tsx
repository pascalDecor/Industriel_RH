import { addSpecialite } from "@/app/actions/specialites";
import Button from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import FloatingLabelInput from "@/components/ui/input";
import { Specialite } from "@/models/specialite";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function AddSpecialites({ specialite }: { specialite: Specialite }) {

    let [state, action, pending] = useActionState(addSpecialite, undefined);
    const [libelle, setLibelle] = useState(specialite.libelle);

    useEffect(() => {
        setLibelle(specialite.libelle);
        if (state === true) {
            redirect('/blog/specialites');
        }
    }, [specialite, state, action, pending]);

    return (
        <>
            <DialogHeader className="text-slate-800">
                <DialogTitle className="text-slate-800 font-semibold">Modifier</DialogTitle>
                <DialogDescription>
                    {specialite.libelle}
                </DialogDescription>
            </DialogHeader>
            <form action={action} className='w-full'>
                <input type="text" name="id" value={specialite.id} hidden />
                <FloatingLabelInput
                    className="w-full"
                    error={state?.errors && state?.errors.libelle && state.errors.libelle.join(', ')}
                    label='Libellé' name="libelle" placeholder="Libellé"
                    value={libelle} onChange={(e) => setLibelle(e.target.value)} />

                <DialogFooter>
                    <Button type="submit" className="mt-5" isLoading={pending} disabled={pending}>Modifier</Button>
                </DialogFooter>
            </form>
        </>
    )
}