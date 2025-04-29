export interface TagProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  libelle: string;
  articles?: ArticleProps[];
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

export interface UserProps {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; // URL de l'avatar ou placeholder
}
