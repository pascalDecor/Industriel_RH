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

  get sectorId(): string {
    return this.props.sectorId;
  }

  /** Mise à jour partielle */
  update(
    fields: Partial<Omit<FonctionProps, "id" | "createdAt" | "updatedAt">>
  ) {
    this.props = { ...this.props, ...fields };
    return this;
  }
}
