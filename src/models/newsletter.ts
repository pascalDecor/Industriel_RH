"use client";

import { BaseModel } from "./baseModel";

export interface NewsletterProps {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    firstName: string;
    lastName: string;
    email: string;
    specialites?: Array<{ id: string; libelle: string; libelle_en?: string }>;
    subscribedAt?: Date;
    status: 'active' | 'unsubscribed';
    unsubscribedAt?: Date;
}

export class Newsletter extends BaseModel<NewsletterProps> {
    constructor(props: NewsletterProps) {
        super({
            ...props
        });
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    get firstName(): string {
        return this.props.firstName;
    }

    get lastName(): string {
        return this.props.lastName;
    }

    get fullName(): string {
        return `${this.props.firstName} ${this.props.lastName}`;
    }

    get email(): string {
        return this.props.email;
    }

    get specialites(): Array<{ id: string; libelle: string; libelle_en?: string }> {
        return this.props.specialites || [];
    }

    get areasOfInterest(): string[] {
        return this.props.specialites?.map(spec => spec.libelle) || [];
    }

    get subscribedAt(): Date | undefined {
        return this.props.subscribedAt;
    }

    get status(): 'active' | 'unsubscribed' {
        return this.props.status;
    }

    get unsubscribedAt(): Date | undefined {
        return this.props.unsubscribedAt;
    }

    get isActive(): boolean {
        return this.props.status === 'active';
    }

    // Méthodes utilitaires
    unsubscribe(): Newsletter {
        return new Newsletter({
            ...this.props,
            status: 'unsubscribed',
            unsubscribedAt: new Date()
        });
    }

    resubscribe(): Newsletter {
        return new Newsletter({
            ...this.props,
            status: 'active',
            unsubscribedAt: undefined
        });
    }

    updateSpecialites(specialites: Array<{ id: string; libelle: string; libelle_en?: string }>): Newsletter {
        return new Newsletter({
            ...this.props,
            specialites: specialites
        });
    }


    toJSON(): any {
        return {
            id: this.id,
            createdAt: this.createdAt?.toISOString(),
            updatedAt: this.updatedAt?.toISOString(),
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            specialites: this.specialites,
            subscribedAt: this.subscribedAt?.toISOString(),
            status: this.status,
            unsubscribedAt: this.unsubscribedAt?.toISOString()
        };
    }
}