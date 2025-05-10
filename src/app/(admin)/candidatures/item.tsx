import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Application } from "@/models/application";
import { LuDownload, LuPhone, LuTrash2 } from "react-icons/lu";

import { HttpService } from "@/utils/http.services";
import { useState } from "react";
import { userAvartarURL } from "@/constant/api";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import { FaRegEnvelope } from "react-icons/fa6";
import { TiLocationOutline } from "react-icons/ti";
import { getFileIcon } from "@/components/ui/inputFile";

export default function ItemCandidatures({ candidature, onChange }: { candidature: Application, onChange: (state: any) => void }) {

    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingValidate, setLoadingValidate] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const handleDelete = (id: string) => () => {
        setLoadingDelete(true);
        HttpService.delete<Application>({
            url: `/applications/${id}`,
        }).then((res) => {
            console.log(res);
            setLoadingDelete(false);
            if (res) {
                onChange(res);
            }
        })
    }

    const handleValidate = (id: string) => () => {
        setLoadingValidate(true);
        HttpService.update<Application>({
            url: `/applications/${id}`,
            data: { "state": "accepted" }
        }).then((res) => {
            console.log(res);
            setLoadingValidate(false);
            if (res) {
                onChange(res);
            }
        })
    }

    const handleReject = (id: string) => () => {
        setLoadingReject(true);
        HttpService.update<Application>({
            url: `/applications/${id}`,
            data: { "state": "rejected" }
        }).then((res) => {
            console.log(res);
            setLoadingReject(false);
            if (res) {
                onChange(res);
            }
        })
    }


    return (
        <Card className="p-5 border-none mb-3 shadow-none flex flex-row justify-between items-start" key={candidature.id}>
            <div>
                <div className="flex items-center space-x-4 mb-4">
                    <Image src={imagePathFinder.avatar} alt={candidature.lastName + " " + candidature.firstName} width={50} height={50} className="rounded-full bg-slate-300" />
                    <div>
                        <div className="flex items-center space-x-2">
                            <p className="mb-0.5 text-slate-700 font-semibold py-0 text-sm">
                                {candidature.lastName} {candidature.firstName}
                            </p>
                            <div className="bg-slate-200 text-slate-600  rounded-full text-[10px] px-2 py-1">
                                {candidature.state}
                            </div>
                        </div>
                        <p className="my-0 text-slate-500 py-0 text-sm flex items-center space-x-2">
                            <FaRegEnvelope />    <span>{candidature.email}</span> .
                            <LuPhone /> <span>{candidature.phone}</span> .
                            <TiLocationOutline /> <span>{candidature.city?.libelle}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center  space-x-2">
                    <div className="bg-green-100 text-green-700 font-semibold rounded-full text-sm px-2 py-1">
                        {candidature.sector?.libelle}
                    </div>
                    <p className=" text-slate-700  font-semibold text-sm">
                        {candidature.function?.libelle} . {candidature.year_of_experience} années d'expérience
                    </p>
                </div>

            </div>
            <div className="flex flex-col items-end justify-between h-full">
                <div className="flex items-center space-x-2">
                    {candidature.state === "pending" && <Button onClick={handleValidate(candidature.id)} title="Valider"
                        isLoading={loadingValidate} className="!p-2" variant="success" size="sm">Valider</Button>}
                    {(candidature.state === "accepted" || candidature.state === "pending") && <Button onClick={handleReject(candidature.id)} title="Décliner"
                        isLoading={loadingReject} className="!p-2 !text-slate-700" variant="warning" size="sm">Décliner</Button>}
                    <Button loadingColor="red" isLoading={loadingDelete} onClick={handleDelete(candidature.id)} title="Supprimer" variant="danger" size="sm" className="!rounded-full text-[11px] h-8 w-8 !bg-red-200 !text-red-700 !p-2">
                        {!loadingDelete && <LuTrash2 className="h-5 w-5" />}
                    </Button>
                </div>
                <p className="my-2.5 text-slate-500 text-sm py-0">
                    crée le {formatDateFr(candidature.createdAt ?? new Date())}
                </p>
                <div className="flex items-center space-x-2">
                    <a className="flex items-center space-x-2 text-slate-500 text-sm py-1 px-3 border-2 rounded-full border-slate-200 hover:border-slate-400 hover:text-slate-700 hover:no-underline" href={candidature.cv} target="_blank" rel="noreferrer">
                        {getFileIcon(candidature.cv, "!w-4 !h-4 mx-auto mr-2")}
                        <span>Curriculum Vitae</span>
                        <LuDownload />
                    </a>
                    <a className="flex items-center space-x-2 text-slate-500 text-sm py-1 px-3 border-2 rounded-full border-slate-200 hover:border-slate-400 hover:text-slate-700 hover:no-underline" href={candidature.coverLetter} target="_blank" rel="noreferrer">
                        {getFileIcon(candidature.coverLetter, "!w-4 !h-4 mx-auto mr-2")}
                        <span>Lettre de présentation</span>
                        <LuDownload />
                    </a>
                </div>
            </div>

        </Card>
    )
}