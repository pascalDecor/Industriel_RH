"use client";

import { BaseModel } from "./baseModel";
import { CityProps } from "./props";

export class City extends BaseModel<CityProps> {
  constructor(props: CityProps) {
    super({
      ...props
    });
  }

  /**
   * Date de création de la civilité
   * @readonly
   */
  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get libelle(): string {
    return this.props.libelle;
  }

}
