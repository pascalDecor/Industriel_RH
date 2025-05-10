import prisma from '@/lib/connect_db';
import { Tag } from "@prisma/client";
import { withQuery } from "@/lib/prisma/helpers";

export const GET = withQuery<Tag, typeof prisma.civility>(
    prisma.civility,
    {
        searchFields: ['libelle'],
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'asc',
    }
)

