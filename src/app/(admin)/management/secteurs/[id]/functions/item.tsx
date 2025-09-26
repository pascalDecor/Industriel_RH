import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { HiOutlineLanguage } from "react-icons/hi2";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import { Fonction } from "@/models/fonction";
import AddFonctions from "./add";

export default function ItemFonctions({ fonction, onChange }: Readonly<{ fonction: Fonction, onChange: (state: any) => void }>) {

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [showEnglish, setShowEnglish] = useState(false);
    const handleDelete = (id: string) => () => {
        console.log("id", id);
        setLoadingDelete(true);
        HttpService.delete<Fonction>({
            url: `/fonctions/${id}`,
        }).then((res) => {
            console.log(res);
            setLoadingDelete(false);
            if (res) {
                onChange(res);
            }
        })
    }


    return (
        <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start" key={fonction.id}>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <p className="my-0 text-slate-700 font-semibold py-0 mb-0">
                        {showEnglish ? (fonction.libelle_en || fonction.libelle) : fonction.libelle}
                    </p>
                    {fonction.libelle_en && (
                        <Button
                            onClick={() => setShowEnglish(!showEnglish)}
                            variant={showEnglish ? "primary" : "secondary"}
                            size="sm"
                            className="!h-6 !px-2 !text-[10px] flex items-center gap-1"
                            title={showEnglish ? "Voir en français" : "Voir en anglais"}
                        >
                            <HiOutlineLanguage className="h-3 w-3" />
                            {showEnglish ? 'FR' : 'EN'}
                        </Button>
                    )}
                </div>

                {showEnglish && !fonction.libelle_en && (
                    <p className="text-orange-600 text-xs italic mb-1">Version anglaise non disponible</p>
                )}

                <p className="my-0 text-slate-700 text-sm py-0">
                    crée le {formatDateFr(fonction.createdAt ?? new Date())}
                </p>
            </div>
            <div className="flex space-x-2">

                <Dialog>
                    <DialogTrigger>
                        <Button title="Modifier" variant="success" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-green-200 !text-green-700 !p-2">
                            <MdOutlineModeEditOutline className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <AddFonctions sectorId={fonction.sectorId} fonction={fonction} onChange={onChange} />
                    </DialogContent>
                </Dialog>

                <Button loadingColor="red" isLoading={loadingDelete} onClick={handleDelete(fonction.id)} title="Supprimer" variant="danger" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2">
                    {!loadingDelete && <LuTrash2 className="h-5 w-5" />}
                </Button>
            </div>

        </Card>
    )
}