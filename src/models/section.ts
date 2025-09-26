"use client";

import { BaseModel } from "./baseModel";
import { SectionProps } from "./props";

export class Section extends BaseModel<SectionProps> {
  constructor(props: SectionProps) {
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

  get libelle(): string {
    return this.props.libelle;
  }

  get libelle_en(): string | undefined {
    return this.props.libelle_en;
  }

  get description(): string {
    return this.props.description ?? "";
  }

  get description_en(): string | undefined {
    return this.props.description_en;
  }

  get page(): string {
    return this.props.page ?? "";
  }

  get image(): string {
    return this.props.image ?? "";
  }
  get sectorId(): string {
    return this.props.sectorId ?? "";
  }

  get slug(): string {
    return this.props.slug;
  }
}
