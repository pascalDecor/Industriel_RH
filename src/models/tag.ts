import { BaseModel } from "./baseModel";
import { TagProps } from "./props";

export class Tag extends BaseModel<TagProps> {
  constructor(props: TagProps) {
    super({
      ...props
    });
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get libelle(): string {
    return this.props.libelle;
  }

  /** Mise à jour partielle */
  update(
    fields: Partial<Omit<TagProps, "id" | "createdAt" | "updatedAt">>
  ) {
    this.props = { ...this.props, ...fields };
    return this;
  }
}
