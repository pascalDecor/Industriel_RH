export interface TagProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  articles?: ArticleProps[];
}


export interface CivilityProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
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
  sectorId: string;
}

export interface SectorProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  functions?: FonctionProps[];
  _count?: {
    functions: number;
  };
  Sections?: SectionProps[];
}

export interface SectionProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  description? : string;
  page?: string;
  image?: string;
  sectorId?: string;
}

export interface SpecialiteProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
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
  contenu: JSON[];
  published: boolean;
  image?: string;
  views: number;
  authorId: string;
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
  year_of_experience : number;
  cv: string;
  coverLetter?: string;
  state: string;
  sectorId: string;
  functionId: string;
  civilityId: string;
  cityId: string;
  sector?: SectorProps;
  function?: FonctionProps;
  civility?: CivilityProps;
  city?: CityProps;
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
