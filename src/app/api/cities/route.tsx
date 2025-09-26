import prisma from '@/lib/connect_db';
import { City } from "@prisma/client";
import { withQuery } from "@/lib/prisma/helpers";

export const GET = withQuery<City, typeof prisma.city>(
    prisma.city,
    {
        searchFields: ['libelle'],
        defaultSortBy: 'libelle',
        defaultSortOrder: 'asc',
    }
)

