import { BaseModel } from "./baseModel";
import { CivilityProps } from "./props";

export class Civility extends BaseModel<CivilityProps> {
  constructor(props: CivilityProps) {
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
