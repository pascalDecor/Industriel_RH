-- AlterTable
ALTER TABLE "SectionUI" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sector" ADD COLUMN     "alternativeDescriptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "description" DROP NOT NULL;
