import SyncLoader from "react-spinners/ClipLoader";

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
