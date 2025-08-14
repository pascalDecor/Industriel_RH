"use client";

import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import Image from "next/image";
import { LuDownload, LuPhone, LuTrash2 } from "react-icons/lu";
import { HttpService } from "@/utils/http.services";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getFileIcon } from "@/components/ui/inputFile";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { FaRegEnvelope } from "react-icons/fa";
import { Hire } from "@/models/hire";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import EditorContent from "@/components/ui/editorContent";

interface DetailsHiresClientProps {
    hireId: string;
}

export function DetailsHiresClient({ hireId }: DetailsHiresClientProps) {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const [hire, setHire] = useState<Hire>(Hire.fromJSON({} as any));

    useEffect(() => {
        HttpService.show<Hire>({
            url: `/hires/${hireId}`,
            fromJson: (json: any) => Hire.fromJSON(json)
        }).then((res) => {
            if (res) {
                setHire(res.data ?? Hire.fromJSON({} as any));
            }
        })
    }, [hireId]);

    const handleDelete = (id: string) => () => {
        console.log("id", id);
        setLoadingDelete(true);
        HttpService.delete<Hire>({
            url: `/hires/${id}`,
        }).then((res) => {
            console.log(res);
            setLoadingDelete(false);
            if (res) {
                redirect('/hires');
            }
        })
    }

    const handleValidate = (id: string) => () => {
        setLoadingValidate(true);
        HttpService.update<Hire>({
            url: `/hires/${id}`,
            data: { "state": "accepted" }
        }).then((res) => {
            console.log(res);
            setLoadingValidate(false);
            if (res) {
                setHire(res.response?.data ?? Hire.fromJSON({} as any));
            }
        })
    }

    const handleReject = (id: string) => () => {
        setLoadingReject(true);
        HttpService.update<Hire>({
            url: `/hires/${id}`,
            data: { "state": "rejected" }
        }).then((res) => {
            console.log(res);
            setLoadingReject(false);
            if (res) {
                setHire(res.response?.data ?? Hire.fromJSON({} as any));
            }
        })
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div className="col-span-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/hires">Embauches</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <Slash />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">{hire?.company_name} hire</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="col-span-6">
                    <div className="flex flex-row justify-between items-center w-full">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">{hire?.company_name} Hire</h2>
                            <p className="my-0 text-slate-700 text-sm py-0">
                                Crée le {formatDateFr(hire?.createdAt ?? new Date())}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Button 
                                loadingColor="red" 
                                isLoading={loadingDelete} 
                                onClick={handleDelete(hire?.id ?? '')} 
                                title="Supprimer" 
                                variant="danger" 
                                size="sm" 
                                className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2"
                            >
                                {!loadingDelete && <LuTrash2 className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start">
                <div>
                    <div className="flex items-center space-x-4 mb-4">
                        <Image loading="lazy" src={imagePathFinder.hire} alt={hire.lastName + " " + hire.firstName} width={50} height={50} className="rounded-full bg-blue-200" />
                        <div>
                            <div className="flex items-center space-x-2">
                                <p className="mb-0.5 text-slate-700 font-semibold py-0 text-sm">
                                    {hire.lastName} {hire.firstName}
                                </p>
                                <div className="bg-slate-200 text-slate-600  rounded-full text-[10px] px-2 py-1">
                                    {hire.state}
                                </div>
                            </div>
                            <p className="my-0 text-slate-500 py-0 text-sm flex items-center space-x-2">
                                <FaRegEnvelope />    <span>{hire.email}</span> .
                                <LuPhone /> <span>{hire.phone}</span> .
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center  space-x-2">
                        <div className="bg-green-100 text-green-700 font-semibold rounded-full text-sm px-2 py-1">
                            {hire.sectors?.map(s => s.libelle).join(' | ')}
                        </div>
                        <p className=" text-slate-700  font-semibold text-sm">
                            {hire.number_of_positions} poste{hire.number_of_positions > 1 && "s"}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full">
                    <div className="flex items-center space-x-2">
                        {hire.state === "pending" && (
                            <Button 
                                onClick={handleValidate(hire.id)} 
                                title="Valider" 
                                isLoading={loadingValidate} 
                                className="!p-2" 
                                variant="success" 
                                size="sm"
                            >
                                Valider
                            </Button>
                        )}
                        {(hire.state === "accepted" || hire.state === "pending") && (
                            <Button 
                                onClick={handleReject(hire.id)} 
                                title="Décliner" 
                                isLoading={loadingReject} 
                                className="!p-2 !text-slate-700" 
                                variant="warning" 
                                size="sm"
                            >
                                Décliner
                            </Button>
                        )}
                    </div>
                    <p className="my-2.5 text-slate-500 text-sm py-0">
                        crée le {formatDateFr(hire.createdAt ?? new Date())}
                    </p>
                    <div className="flex items-center space-x-2">
                        {hire.document_support && (
                            <a 
                                className="flex items-center space-x-2 text-slate-500 text-sm py-1 px-3 border-2 rounded-full border-slate-200 hover:border-slate-400 hover:text-slate-700 hover:no-underline" 
                                href={hire.document_support} 
                                target="_blank" 
                                rel="noreferrer"
                            >
                                {getFileIcon(hire.document_support, "!w-4 !h-4 mx-auto mr-2")}
                                <span>Curriculum Vitae</span>
                                <LuDownload />
                            </a>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start">
                <p className="text-slate-700 -mt-5 p-5">
                    <EditorContent content={hire.details_of_positions} />
                </p>
            </Card>
        </div>
    );
}