"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder"
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/lib/load.helper"
import { HttpService } from "@/utils/http.services"
import { useState } from "react";
import Pagination from "@/components/paginationCustom";
import FloatingLabelInput from "@/components/ui/input";
import { FiMail, FiCalendar, FiUser } from "react-icons/fi";
import { Newsletter } from "@/models/newsletter";

interface NewslettersListProps {
    isVisible: boolean;
}

export default function NewslettersList({ isVisible }: NewslettersListProps) {
    const [changeCount, setChangeCount] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    const handleExportCSV = async () => {
        try {
            const response = await fetch('/api/newsletters/export', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `newsletters_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                alert('Erreur lors de l\'export');
            }
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            alert('Erreur lors de l\'export');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedEmails.length === 0) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedEmails.length} abonnement(s) ?`)) {
            try {
                const response = await fetch('/api/newsletters/bulk-delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ emails: selectedEmails }),
                });

                if (response.ok) {
                    setSelectedEmails([]);
                    setChangeCount(c => c + 1);
                } else {
                    alert('Erreur lors de la suppression');
                }
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleEmailSelection = (email: string) => {
        setSelectedEmails(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const selectAllEmails = (emails: string[]) => {
        setSelectedEmails(emails);
    };

    return (
        <div className="space-y-4">
            <div className={`flex items-center justify-end space-x-2 transition-all duration-500 delay-300 ease-out transform ${
                isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-6 scale-95'
            }`}>
                <div className="relative group">
                    <FloatingLabelInput
                        className="!w-[300px] transition-all duration-300 group-hover:!w-[350px] focus:!w-[350px]"
                        label='Rechercher par email ou nom'
                        name="search"
                        placeholder="Rechercher par email ou nom"
                        value={search ?? ''}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setChangeCount(c => c + 1);
                        }}
                    />
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {selectedEmails.length > 0 && (
                    <Button
                        onClick={handleBulkDelete}
                        className="py-3 bg-red-600 hover:bg-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Supprimer ({selectedEmails.length})
                    </Button>
                )}

                <Button
                    onClick={handleExportCSV}
                    className="py-3 relative overflow-hidden group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    <span className="relative z-10">Exporter CSV</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out"></div>
                </Button>
            </div>

            <div className={`grid grid-cols-1 gap-4 transition-all duration-700 delay-400 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
                <AsyncBuilder
                    promise={async () => {
                        return HttpService.index<Newsletter>({
                            url: `/newsletters?page=${page}&search=${search}`,
                            fromJson: (json: any) => Newsletter.fromJSON(json)
                        });
                    }}
                    loadingComponent={
                        <div className="flex items-center justify-center p-8">
                            <LoadingSpinner color="#3B82F6" />
                        </div>
                    }
                    emptyComponent={
                        <div className="text-center bg-white rounded-lg p-10 shadow-sm border animate-in fade-in-0 zoom-in-95 duration-500">
                            <div className="text-slate-400 text-6xl mb-4 animate-bounce">📧</div>
                            <h3 className="text-lg font-semibold text-slate-600 mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-200">
                                {search ? 'Aucun résultat trouvé' : 'Aucun abonnement'}
                            </h3>
                            <p className="text-slate-500 text-sm animate-in slide-in-from-bottom-2 duration-500 delay-300">
                                {search
                                    ? `Aucun abonnement ne correspond à "${search}"`
                                    : 'Aucun abonnement à la newsletter pour le moment'
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
                    onDataChange={(data) => {
                        if (data) {
                            setPage(data.meta.page);
                        }
                    }}
                    hasData={(data) => {
                        const allEmails = data.data.map((newsletter: Newsletter) => newsletter.email);
                        return (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between backdrop-blur-sm bg-white/50 rounded-lg p-3 border-none border-slate-200/50 shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <p className="text-slate-700 text-sm font-semibold">
                                            {data.meta.total} abonnement{data.meta.total > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedEmails.length === allEmails.length && allEmails.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    selectAllEmails(allEmails);
                                                } else {
                                                    setSelectedEmails([]);
                                                }
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-xs text-slate-500">Tout sélectionner</span>
                                        {data.meta.totalPages > 1 && (
                                            <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full ml-4">
                                                Page {data.meta.page} sur {data.meta.totalPages}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Sélection
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        <FiUser className="inline mr-1" />
                                                        Abonné
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        <FiMail className="inline mr-1" />
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Centres d'intérêt
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        <FiCalendar className="inline mr-1" />
                                                        Date d'abonnement
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Statut
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {data.data.map((newsletter: Newsletter, index: number) => (
                                                    <tr
                                                        key={newsletter.id}
                                                        className="hover:bg-gray-50 transition-colors duration-150"
                                                        style={{
                                                            animationDelay: `${index * 80}ms`,
                                                            animation: 'slideInFromBottom 0.5s ease-out forwards',
                                                        }}
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedEmails.includes(newsletter.email)}
                                                                onChange={() => toggleEmailSelection(newsletter.email)}
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {newsletter.fullName}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{newsletter.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {newsletter.specialites.slice(0, 2).map((specialite, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                                        title={specialite.libelle}
                                                                    >
                                                                        {specialite.libelle}
                                                                    </span>
                                                                ))}
                                                                {newsletter.specialites.length > 2 && (
                                                                    <span
                                                                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                                                                        title={newsletter.specialites.slice(2).map(spec => spec.libelle).join(', ')}
                                                                    >
                                                                        +{newsletter.specialites.length - 2}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {newsletter.subscribedAt ? formatDate(newsletter.subscribedAt.toISOString()) : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                newsletter.isActive
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {newsletter.isActive ? 'Actif' : 'Désabonné'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
                                                                        console.log('Delete newsletter:', newsletter.id);
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                                            >
                                                                Supprimer
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
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
                                                    setChangeCount(c => c + 1);
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
    );
}