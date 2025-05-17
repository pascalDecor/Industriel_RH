import { Article } from "./article";
import { BaseModel } from "./baseModel";
import { SpecialiteProps } from "./props";

export class Specialite extends BaseModel<SpecialiteProps> {
  constructor(props: SpecialiteProps) {
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

  get articles(): Article[] {
    return this.props.articles?.map((a) => new Article(a)) ?? [];
  }

  get articleCount(): number {
    return this.props._count?.articles ?? 0;
  }
}
