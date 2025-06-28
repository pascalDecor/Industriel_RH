"use client";

import dynamic from "next/dynamic";

const SyncLoader =     dynamic(() => import("react-spinners/ClipLoader").then(mod => mod.default), { ssr: false });

export function LoadingSpinner({
  color = "#fff"
}: {
  color?: string;
}) {
  return (

    <SyncLoader
      color={color ?? "#fff"}
      loading={true}
      size={15}
      aria-label="Loading Spinner"
      data-testid="loader"
    />

  );
}
