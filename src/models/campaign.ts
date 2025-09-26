"use client";

import { BaseModel } from "./baseModel";

export interface CampaignProps {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    title: string;
    subject: string;
    content: string;
    templateId?: string;
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';
    scheduledAt?: Date;
    sentAt?: Date;
    createdBy: string;
    audience?: {
        type: 'all' | 'specialities' | 'custom';
        specialityIds?: string[];
        subscriberIds?: string[];
        subscriberCount?: number;
    };
    stats?: {
        totalSent: number;
        delivered: number;
        opened: number;
        clicked: number;
        bounced: number;
        unsubscribed: number;
        openRate: number;
        clickRate: number;
        bounceRate: number;
    };
    testEmails?: string[];
}

export class Campaign extends BaseModel<CampaignProps> {
    constructor(props: CampaignProps) {
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

    get title(): string {
        return this.props.title;
    }

    get subject(): string {
        return this.props.subject;
    }

    get content(): string {
        return this.props.content;
    }

    get templateId(): string | undefined {
        return this.props.templateId;
    }

    get status(): 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled' {
        return this.props.status;
    }

    get scheduledAt(): Date | undefined {
        return this.props.scheduledAt;
    }

    get sentAt(): Date | undefined {
        return this.props.sentAt;
    }

    get createdBy(): string {
        return this.props.createdBy;
    }

    get audience(): CampaignProps['audience'] {
        return this.props.audience;
    }

    get stats(): CampaignProps['stats'] {
        return this.props.stats;
    }

    get testEmails(): string[] {
        return this.props.testEmails || [];
    }

    get isDraft(): boolean {
        return this.props.status === 'draft';
    }

    get isScheduled(): boolean {
        return this.props.status === 'scheduled';
    }

    get isSent(): boolean {
        return this.props.status === 'sent';
    }

    get canEdit(): boolean {
        return ['draft', 'scheduled'].includes(this.props.status);
    }

    get canSend(): boolean {
        return this.props.status === 'draft' && !!this.props.content && !!this.props.subject;
    }

    get canSchedule(): boolean {
        return this.canSend;
    }

    // Méthodes utilitaires
    updateContent(content: string): Campaign {
        return new Campaign({
            ...this.props,
            content,
            updatedAt: new Date()
        });
    }

    updateSubject(subject: string): Campaign {
        return new Campaign({
            ...this.props,
            subject,
            updatedAt: new Date()
        });
    }

    updateTitle(title: string): Campaign {
        return new Campaign({
            ...this.props,
            title,
            updatedAt: new Date()
        });
    }

    schedule(scheduledAt: Date): Campaign {
        return new Campaign({
            ...this.props,
            status: 'scheduled',
            scheduledAt,
            updatedAt: new Date()
        });
    }

    send(): Campaign {
        return new Campaign({
            ...this.props,
            status: 'sending',
            sentAt: new Date(),
            updatedAt: new Date()
        });
    }

    markAsSent(stats: CampaignProps['stats']): Campaign {
        return new Campaign({
            ...this.props,
            status: 'sent',
            stats,
            updatedAt: new Date()
        });
    }

    cancel(): Campaign {
        return new Campaign({
            ...this.props,
            status: 'cancelled',
            updatedAt: new Date()
        });
    }

    updateAudience(audience: CampaignProps['audience']): Campaign {
        return new Campaign({
            ...this.props,
            audience,
            updatedAt: new Date()
        });
    }

    addTestEmail(email: string): Campaign {
        const testEmails = [...(this.props.testEmails || [])];
        if (!testEmails.includes(email)) {
            testEmails.push(email);
        }
        return new Campaign({
            ...this.props,
            testEmails,
            updatedAt: new Date()
        });
    }

    removeTestEmail(email: string): Campaign {
        const testEmails = (this.props.testEmails || []).filter(e => e !== email);
        return new Campaign({
            ...this.props,
            testEmails,
            updatedAt: new Date()
        });
    }


    toJSON(): any {
        return {
            id: this.id,
            createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : this.createdAt,
            updatedAt: this.updatedAt instanceof Date ? this.updatedAt.toISOString() : this.updatedAt,
            title: this.title,
            subject: this.subject,
            content: this.content,
            templateId: this.templateId,
            status: this.status,
            scheduledAt: this.scheduledAt instanceof Date ? this.scheduledAt.toISOString() : this.scheduledAt,
            sentAt: this.sentAt instanceof Date ? this.sentAt.toISOString() : this.sentAt,
            createdBy: this.createdBy,
            audience: this.audience,
            stats: this.stats,
            testEmails: this.testEmails
        };
    }
}