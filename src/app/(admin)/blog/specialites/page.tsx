"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder"
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { LoadingSpinner } from "@/lib/load.helper"
import { Specialite } from "@/models/specialite"
import { HttpService } from "@/utils/http.services"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import AddSpecialites from "./add";

export default function Specialites() {
    return (
        <div className="space-y-8">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Spécialités</h2>
                    <p className="text-slate-700 text-sm">Page de gestion des spécialités</p>
                </div>
                <Dialog>
                    <DialogTrigger>
                        <Button>Ajouter une spécialité</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <AddSpecialites specialite={Specialite.fromJSON({} as any)} />
                    </DialogContent>
                </Dialog>

            </div>

            <div>
                <AsyncBuilder promise={async () => {
                    return HttpService.index<Specialite>({
                        url: '/specialites',
                        fromJson: (json: any) => Specialite.fromJSON(json)
                    });
                }} loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                    hasData={data =>
                        data.map(s =>
                            <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-center" key={s.id}>
                                <div>
                                    <p className="my-0 text-slate-700 font-semibold py-0">
                                        {s.libelle}
                                    </p>
                                    <p className="my-0 text-slate-700 text-sm py-0">
                                        {s.articleCount} article(s) . crée le {formatDateFr(s.createdAt ?? new Date())}
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
                                            <AddSpecialites specialite={s} />
                                        </DialogContent>
                                    </Dialog>


                                    <Button title="Supprimer" variant="danger" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2">
                                        <LuTrash2 className="h-5 w-5" />
                                    </Button>
                                </div>

                            </Card>
                        )} />
            </div>
        </div>
    )
}