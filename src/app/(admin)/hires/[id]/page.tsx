import { DetailsHiresClient } from "./details-hires-client";

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function DetailsHires({ params }: PageProps) {
    const { id } = await params;
    
    return <DetailsHiresClient hireId={id} />;
}