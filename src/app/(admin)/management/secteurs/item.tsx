import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Sector } from "@/models/sector";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import AddSectors from "./add";
import { HttpService } from "@/utils/http.services";
import { useState } from "react";

type ItemSectorsProps = {
    sector: Sector,
    onChange?: (state: any) => void,
    onActive?: (sector: Sector) => void
}

export default function ItemSectors({ sector, onChange, onActive }: ItemSectorsProps) {


    let [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);

    const [loadingDelete, setLoadingDelete] = useState(false);
    const handleDelete = (id: string) => () => {
        console.log("id", id);
        setLoadingDelete(true);
        HttpService.delete<Sector>({
            url: `/sectors/${id}`,
        }).then((res) => {
            console.log(res);
            setLoadingDelete(false);
            if (res) {
                if (onChange) {
                    onChange(res);
                }
            }
        })
    }


    return (
        <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-center cursor-pointer hover:shadow-md"
            key={sector.id} onClick={() => onActive && onActive(sector)}>
            <div>
                <p className="my-0 text-slate-700 font-semibold py-0">
                    {sector.libelle}
                </p>
                <p className="my-0 text-slate-700 text-sm py-0">
                    {sector.functionsCount} fonction(s) . crée le {formatDateFr(sector.createdAt ?? new Date())}
                </p>
            </div>
            <div className="flex space-x-2">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button title="Modifier" variant="success" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-green-200 !text-green-700 !p-2">
                            <MdOutlineModeEditOutline className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <AddSectors sector={sector} onChange={state => {
                            if (state) {
                                setchangeCount(c => c + 1);
                                setOpen(false);
                            }
                        }} />
                    </DialogContent>
                </Dialog>


                <Button loadingColor="red" isLoading={loadingDelete} onClick={handleDelete(sector.id)} title="Supprimer" variant="danger" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2">
                    {!loadingDelete && <LuTrash2 className="h-5 w-5" />}
                </Button>
            </div>

        </Card>
    )
}