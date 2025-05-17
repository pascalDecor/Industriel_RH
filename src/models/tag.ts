import { BaseModel } from "./baseModel";
import { TagProps } from "./props";

export class Tag extends BaseModel<TagProps> {
  constructor(props: TagProps) {
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

}
