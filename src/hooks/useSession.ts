// hooks/useSession.ts
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then(async (res) =>
    res.status === 204 ? null : { ...(await res.json()), status: res.status }
  );

export function useSession() {
  const { data, error, mutate } = useSWR<{ session: any; status: number }>(
    "/api/auth/session",
    fetcher
  );

  return {
    session: data?.session ?? null,
    isLoading: !data?.status,
    isError: error,
    mutate // pour rafraîchir manuellement si besoin
  };
}
