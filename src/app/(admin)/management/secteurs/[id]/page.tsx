"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Button from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatDateFr } from "@/lib/formatDate";
import { LoadingSpinner } from "@/lib/load.helper";
import { Sector } from "@/models/sector";
import { HttpService } from "@/utils/http.services"
import { Slash } from "lucide-react";
import { LuTrash2 } from "react-icons/lu";
import { MdOutlineModeEditOutline } from "react-icons/md";
import AddSectors from "../add";
import { useState } from "react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FonctionsListe from "./functions/liste";
import { SectorSections } from "./sections";

interface Props {
    params: {
        id: string
    }
}


export default function Secteur({ params }: Props) {
    const { id } = params;

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);


    const handleDelete = (id: string) => () => {
        console.log("id", id);
        setLoadingDelete(true);
        HttpService.delete<Sector>({
            url: `/sectors/${id}`,
        }).then((res) => {
            console.log(res);
            setLoadingDelete(false);
            if (res) {
                redirect('/management/secteurs');
            }
        })
    }

    return <AsyncBuilder
        promise={async () => {
            return HttpService.show<Sector>({
                url: `/sectors/${id}`,
                fromJson: (json: any) => Sector.fromJSON(json)
            });
        }}
        callDataListen={changeCount}
        loadingComponent={<LoadingSpinner color="#0F766E" />}
        hasData={(data) => {
            const { data: sector } = data;
            return <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="col-span-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/management/secteurs">Secteurs</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <Slash />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">{sector?.libelle}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                </div>
                <div className="col-span-6">
                    <div className="flex flex-row justify-between items-center w-full">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{sector?.libelle}</h2>
                            <p className="my-0 text-slate-700 text-sm py-0">
                                {sector?.functionsCount} fonction(s) . crée le {formatDateFr(sector?.createdAt ?? new Date())}
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
                                    <AddSectors sector={sector ?? Sector.fromJSON(({} as any))} onChange={state => {
                                        if (state) {
                                            setchangeCount(c => c + 1);
                                            setOpen(false);
                                        }
                                    }} />
                                </DialogContent>
                            </Dialog>


                            <Button loadingColor="red" isLoading={loadingDelete} onClick={handleDelete(sector?.id ?? '')} title="Supprimer" variant="danger" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2">
                                {!loadingDelete && <LuTrash2 className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="col-span-6">
                    <Tabs defaultValue="fonctions" className="w-full">
                        <div className="bg-slate-200 py-0 px-0 w-full rounded-xl">
                            <TabsList className="w-fit px-0 py-5 bg-slate-200">
                                <TabsTrigger className="py-5 px-10 cursor-pointer w-fit" value="fonctions">Fonctions</TabsTrigger>
                                <TabsTrigger className="py-5 px-10 cursor-pointer" value="Sections">Sections</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="fonctions"><FonctionsListe sectorId={sector?.id ?? ''} /></TabsContent>
                        <TabsContent value="Sections">
                            <SectorSections sector={sector!} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        }}
    />
}

