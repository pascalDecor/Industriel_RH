import prisma from '@/lib/connect_db';
import { Tag } from "@prisma/client";
import { withQuery } from "@/lib/prisma/helpers";

export const GET = withQuery<Tag, typeof prisma.city>(
    prisma.city,
    {
        searchFields: ['libelle'],
        defaultSortBy: 'libelle',
        defaultSortOrder: 'asc',
    }
)

