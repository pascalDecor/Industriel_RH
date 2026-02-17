"use client";

import { AsyncBuilder } from "@/components/ui/asyncBuilder";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/lib/load.helper";
import { TeamMember } from "@/models/teamMember";
import { HttpService } from "@/utils/http.services";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddTeamMember from "./add";
import ItemTeamMember from "./item";
import { useState, useCallback } from "react";
import Pagination from "@/components/paginationCustom";
import FloatingLabelInput from "@/components/ui/input";

export default function TeamMembersPage() {
  const [changeCount, setChangeCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchMembers = useCallback(async () => {
    return HttpService.index<TeamMember>({
      url: `/team-members?page=${page}&search=${encodeURIComponent(search)}`,
      fromJson: (json: unknown) => TeamMember.fromJSON(json as ConstructorParameters<typeof TeamMember>[0]),
    });
  }, [page, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Membres de l&apos;équipe</h2>
          <p className="text-slate-700 text-sm">Gérer les noms, postes et liens réseau sociaux</p>
        </div>
        <div className="flex items-center gap-2">
          <FloatingLabelInput
            className="w-[220px]"
            label="Rechercher"
            name="search"
            placeholder="Nom, prénom, poste..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setChangeCount((c) => c + 1);
            }}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="py-3 whitespace-nowrap">Ajouter un membre</Button>
            </DialogTrigger>
            <DialogContent>
              <AddTeamMember
                member={TeamMember.fromJSON({ id: "", nom: "", prenom: "", post: "" } as ConstructorParameters<typeof TeamMember>[0])}
                onChange={(state) => {
                  if (state) {
                    setChangeCount((c) => c + 1);
                    setOpen(false);
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        <AsyncBuilder
          promise={fetchMembers}
          loadingComponent={<LoadingSpinner color="#0F766E" />}
          callDataListen={changeCount}
          autoRefreshOnListen
          hasData={(data) => {
            setPage(data.meta.page);
            return (
              <div className="space-y-4">
                {search && data.data.length === 0 && (
                  <div className="text-center text-slate-500 font-medium bg-white rounded-lg p-10 border border-slate-200">
                    Aucun résultat pour &quot;{search}&quot;
                  </div>
                )}
                {data.data.length > 0 && (
                  <p className="text-slate-700 text-sm font-semibold">
                    {data.meta.total} membre{data.meta.total > 1 ? "s" : ""}
                  </p>
                )}
                <div className="grid gap-3">
                  {data.data.map((m: TeamMember) => (
                    <ItemTeamMember
                      key={m.id}
                      member={m}
                      onChange={() => setChangeCount((c) => c + 1)}
                    />
                  ))}
                </div>
                {data.data.length > 0 && data.meta.totalPages > 1 && (
                  <div className="flex justify-center pt-4">
                    <Pagination
                      currentPage={page}
                      totalPages={data.meta.totalPages}
                      onPageChange={(newPage) => {
                        setPage(newPage);
                        setChangeCount((c) => c + 1);
                      }}
                      siblingCount={1}
                    />
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
