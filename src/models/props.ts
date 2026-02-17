"use client";

import { UserRole } from '@/types/auth';

export interface TagProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  libelle_en?: string;
  articles?: ArticleProps[];
  _count?: {
    articles: number;
  };
}

export interface NoticeProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  content: string;
  content_en?: string;
  author: string;
  author_en?: string;
  stars: number;
}

export interface TeamMemberProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  nom: string;
  prenom: string;
  post: string;
  imageKey?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  website?: string | null;
  order?: number;
}

export interface CivilityProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  libelle_en?: string;
}

export interface CityProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
}

export interface FonctionProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  libelle_en?: string;
  sectorId: string;
}

export interface SectorProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  libelle_en?: string;
  isActive?: boolean;
  isDefaultConsultingSolutions?: boolean;
  functions?: FonctionProps[];
  _count?: {
    functions: number;
  };
  Sections?: SectionProps[];
  description?: string;
  description_en?: string;
  alternativeDescriptions?: string[];
  articles?: ArticleProps[];
}

export interface SectionProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  libelle_en?: string;
  description?: string;
  description_en?: string;
  page?: string;
  image?: string;
  sectorId?: string;
  sector?: SectorProps;
  slug: string;
}

export interface SpecialiteProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  libelle_en?: string;
  articles?: ArticleProps[];
  _count?: {
    articles: number;
  };
}

export interface ArticleProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  titre: string;
  titre_en?: string;
  contenu: JSON[];
  contenu_en?: JSON[];
  published: boolean;
  image?: string;
  views: number;
  authorId: string;
  author?: UserProps;
  tags?: TagProps[];
  specialites?: SpecialiteProps[];
}

export interface ApplicationProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  adresse: string;
  year_of_experience: number;
  cv: string;
  coverLetter?: string;
  state: string;
  isRead?: boolean;
  sectorId: string;
  functionId: string;
  civilityId: string;
  cityId: string;
  sector?: SectorProps;
  function?: FonctionProps;
  civility?: CivilityProps;
  city?: CityProps;
}

export interface HireProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  number_of_positions: number;
  document_support?: string;
  details_of_positions: JSON[];
  company_name: string;
  company_website?: string;
  //
  state: string;
  sectors: SectorProps[];
  civilityId: string;
  civility?: CivilityProps;
}

export interface ContactProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  firstName: string;
  lastName: string;
  companyName?: string;
  jobTitle?: string;
  workEmail: string;
  workPhone: string;
  postalCode?: string;
  message: string;
  status: string;
  priority: string;
  isRead?: boolean;
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FeaturedBlockProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  titre: string;
  titre_en?: string;
  description: string;
  description_en?: string;
  type: string; // 'FEATURED' | 'TAG_RESULTS' | 'PROMOTION' | 'CUSTOM'
  position: number;
  bgColor: string;
  textColor: string;
  linkUrl?: string;
  linkText?: string;
  linkText_en?: string;
  isActive: boolean;
  priority: number;
}
