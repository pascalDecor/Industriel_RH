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

  get alternativeDescriptions(): string[] | undefined {
    return this.props.alternativeDescriptions;
  }


}
