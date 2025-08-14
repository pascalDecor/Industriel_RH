import { SecteurClient } from "./secteur-client";

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function Secteur({ params }: PageProps) {
    const { id } = await params;
    
    return <SecteurClient sectorId={id} />;
}

