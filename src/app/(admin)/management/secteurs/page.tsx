"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder"
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/lib/load.helper"
import { Sector } from "@/models/sector"
import { HttpService } from "@/utils/http.services"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddSectors from "./add";
import ItemSectors from "./item";
import { useState, useEffect } from "react";
import Pagination from "@/components/paginationCustom";
import FloatingLabelInput from "@/components/ui/input";
import { redirect } from "next/navigation";


export default function Sectors() {
    const [changeCount, setchangeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [active, setActive] = useState<Sector | undefined>(undefined);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <>
            <style jsx>{`
                @keyframes slideInFromBottom {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes shimmer {
                    0% { background-position: -200px 0; }
                    100% { background-position: calc(200px + 100%) 0; }
                }
                
                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200px 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>
            <div className={`space-y-4 transition-all duration-700 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>

            <div className={`flex items-center justify-between transition-all duration-500 delay-200 ease-out transform ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}>
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Secteurs
                    </h2>
                    <p className="text-slate-700 text-sm animate-pulse">Page de gestion des secteurs</p>
                </div>
                <div className={`flex items-center justify-end space-x-2 transition-all duration-500 delay-300 ease-out transform ${
                    isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-6 scale-95'
                }`}>
                    <div className="relative group">
                        <FloatingLabelInput
                            className="!w-[500px] transition-all duration-300 group-hover:!w-[220px] focus:!w-[220px]"
                            label='Rechercher un secteur'
                            name="search"
                            placeholder="Rechercher un secteur"
                            value={search ?? ''}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setchangeCount(c => c + 1);
                            }}
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild={true}>
                            <Button className=" py-3 relative overflow-hidden group bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                                <span className="relative z-10">Ajouter un secteur</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out"></div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="animate-in fade-in-0 zoom-in-95 duration-300">
                            <AddSectors sector={Sector.fromJSON(({} as any))} onChange={state => {
                                if (state) {
                                    setchangeCount(c => c + 1);
                                    setOpen(false);
                                }
                            }} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className={`grid grid-cols-1 gap-4 transition-all duration-700 delay-400 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
                <AsyncBuilder 
                    promise={async () => {
                        return HttpService.index<Sector>({
                            url: '/sectors?page=' + page + '&search=' + search,
                            fromJson: (json: any) => Sector.fromJSON(json)
                        });
                    }} 
                    loadingComponent={
                        <div className="flex items-center justify-center p-8">
                            <LoadingSpinner color="#0F766E" />
                        </div>
                    }
                    emptyComponent={
                        <div className="text-center bg-white rounded-lg p-10 shadow-sm border animate-in fade-in-0 zoom-in-95 duration-500">
                            <div className="text-slate-400 text-6xl mb-4 animate-bounce">📁</div>
                            <h3 className="text-lg font-semibold text-slate-600 mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-200">
                                {search ? 'Aucun résultat trouvé' : 'Aucun secteur'}
                            </h3>
                            <p className="text-slate-500 text-sm animate-in slide-in-from-bottom-2 duration-500 delay-300">
                                {search 
                                    ? `Aucun secteur ne correspond à "${search}"` 
                                    : 'Commencez par ajouter votre premier secteur'
                                }
                            </p>
                        </div>
                    }
                    errorComponent={(error, retry) => (
                        <div className="text-center bg-red-50 rounded-lg p-8 border border-red-200 animate-in fade-in-0 zoom-in-95 duration-500">
                            <div className="text-red-400 text-6xl mb-4 animate-pulse">⚠️</div>
                            <h3 className="text-lg font-semibold text-red-600 mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-200">
                                Erreur de chargement
                            </h3>
                            <p className="text-red-500 text-sm mb-4 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                                {error.message}
                            </p>
                            <button 
                                onClick={retry}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg animate-in slide-in-from-bottom-2 duration-500 delay-400"
                            >
                                Réessayer
                            </button>
                        </div>
                    )}
                    callDataListen={changeCount}
                    autoRefreshOnListen={true}
                    onDataChange={(data) => {
                        if (data) {
                            setPage(data.meta.page);
                        }
                    }}
                    hasData={(data) => {
                        return (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between backdrop-blur-sm bg-white/50 rounded-lg p-3 border-none border-slate-200/50 shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 bg-teal-500 rounded-full animate-pulse"></div>
                                        <p className="text-slate-700 text-sm font-semibold">
                                            {data.meta.total} secteur{data.meta.total > 1 ? 's' : ''}
                                        </p>
                                                    </div>
                                    {data.meta.totalPages > 1 && (
                                        <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                            Page {data.meta.page} sur {data.meta.totalPages}
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-3">
                                    {data.data.map((s: any, index: number) => (
                                        <div 
                                            key={s.id} 
                                            className="transition-all duration-500 ease-out transform hover:scale-[1.02] opacity-0"
                                            style={{
                                                animationDelay: `${index * 80}ms`,
                                                animation: 'slideInFromBottom 0.5s ease-out forwards',
                                                animationFillMode: 'both'
                                            }}
                                        >
                                            <div className="group relative overflow-hidden rounded-lg border-none border-slate-200 bg-white shadow-none hover:shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-teal-500/5 hover:to-blue-500/5">
                                                <ItemSectors
                                                    sector={s}
                                                    onChange={(state) => {
                                                        if (state) {
                                                            setchangeCount(c => c + 1);
                                                            setOpen(false);
                                                        }
                                                    }}
                                                    onActive={(s) => {
                                                        setActive(s);
                                                        redirect('/management/secteurs/' + s.id);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {data.meta.totalPages > 1 && (
                                    <div className="flex justify-center pt-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-300">
                                        <div className="backdrop-blur-sm bg-white/80 rounded-xl p-2 shadow-lg">
                                            <Pagination 
                                                className="mx-auto" 
                                                currentPage={page} 
                                                totalPages={data.meta.totalPages} 
                                                onPageChange={newPage => {
                                                    setPage(newPage);
                                                    setchangeCount(c => c + 1);
                                                }} 
                                                siblingCount={1}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }}
                />
            </div>

            </div>
        </>
    )
}
