"use client";

import { BaseModel } from "./baseModel";
import { FeaturedBlockProps } from "./props";

export class FeaturedBlock extends BaseModel<FeaturedBlockProps> {
  constructor(props: FeaturedBlockProps) {
    super(props);
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get titre(): string {
    return this.props.titre;
  }

  get titre_en(): string | undefined {
    return this.props.titre_en;
  }

  get description(): string {
    return this.props.description;
  }

  get description_en(): string | undefined {
    return this.props.description_en;
  }

  get type(): string {
    return this.props.type;
  }

  get position(): number {
    return this.props.position;
  }

  get bgColor(): string {
    return this.props.bgColor;
  }

  get textColor(): string {
    return this.props.textColor;
  }

  get linkUrl(): string | undefined {
    return this.props.linkUrl;
  }

  get linkText(): string | undefined {
    return this.props.linkText;
  }

  get linkText_en(): string | undefined {
    return this.props.linkText_en;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get priority(): number {
    return this.props.priority;
  }

  // Méthodes helper
  getTitle(language: 'fr' | 'en'): string {
    return language === 'en' ? (this.titre_en || this.titre) : this.titre;
  }

  getDescription(language: 'fr' | 'en'): string {
    return language === 'en' ? (this.description_en || this.description) : this.description;
  }

  getLinkText(language: 'fr' | 'en'): string | undefined {
    return language === 'en' ? (this.linkText_en || this.linkText) : this.linkText;
  }
}
