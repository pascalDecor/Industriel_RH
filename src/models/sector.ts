"use client";

import { BaseModel } from "./baseModel";
import { FonctionProps, SectorProps } from "./props";
import { Section } from "./section";

export class Sector extends BaseModel<SectorProps> {
  constructor(props: SectorProps) {
    super({
      ...props,
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

  get sections(): Section[] {
    return this.props.Sections?.map((a) => new Section(a)) ?? [];
  }

  get functionsCount(): number {
    return this.props._count?.functions ?? 0;
  }

  get functions(): FonctionProps[] {
    return this.props.functions ?? [];
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get description_en(): string | undefined {
    return this.props.description_en;
  }

  get alternativeDescriptions(): string[] | undefined {
    return this.props.alternativeDescriptions;
  }

  get isActive(): boolean {
    return this.props.isActive !== false;
  }

  get isDefaultConsultingSolutions(): boolean {
    return this.props.isDefaultConsultingSolutions === true;
  }
}
