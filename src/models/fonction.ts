"use client";

import { BaseModel } from "./baseModel";
import { FonctionProps } from "./props";

export class Fonction extends BaseModel<FonctionProps> {
  constructor(props: FonctionProps) {
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

  get sectorId(): string {
    return this.props.sectorId;
  }
}
