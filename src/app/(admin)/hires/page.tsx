"use client";

import Button from "@/components/ui/button";

import { useState } from "react";
import FloatingLabelInput from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListeEmbauches from "./liste";

interface OngletProps {
    id: "pending" | "accepted" | "rejected";
    libelle: string
}

export default function Embauches() {
    const [search, setSearch] = useState('');
    const onglets: OngletProps[] = [
        {
            id: "pending",
            libelle: "En attente"
        },
        {
            id: "accepted",
            libelle: "Acceptées"
        },
        {
            id: "rejected",
            libelle: "Rejetées"
        }
    ]
    return (
        <div className="space-y-4">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Embauches</h2>
                    <p className="text-slate-700 text-sm">Page de gestion des embauches</p>
                </div>
                <div className="flex items-center justify-end space-x-2">
                    <FloatingLabelInput
                        className="!w-full"
                        label='Rechercher une embauche'
                        placeholder="Rechercher une embauche"
                        type="text"
                        name="search"
                        value={search ?? ''} onChange={(e) => { setSearch(e.target.value); }} />
                    <Button className="w-full py-3 whitespace-nowrap">Ajouter une embauche</Button>
                </div>
            </div>

            <div>
                <Tabs defaultValue={onglets[0].id} className="w-full">
                    <div className="bg-slate-200 py-0 px-0 w-full rounded-xl">
                        <TabsList className="w-fit px-0 py-5 bg-slate-200">
                            {onglets.map(onglet =>
                                <TabsTrigger
                                    key={onglet.id}
                                    className="py-5 px-10 cursor-pointer w-fit"
                                    value={onglet.id}>{onglet.libelle}</TabsTrigger>)}
                        </TabsList>
                    </div>
                    {onglets.map(onglet => <TabsContent
                        key={onglet.id} value={onglet.id}>
                        <ListeEmbauches state={onglet.id} search={search} />
                    </TabsContent>)}
                </Tabs>
            </div>
        </div>
    )
}
