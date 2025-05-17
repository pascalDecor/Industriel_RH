import { BaseModel } from "./baseModel";
import { ArticleProps, TagProps, SpecialiteProps } from "./props";

export class Article extends BaseModel<ArticleProps> {
  constructor(props: ArticleProps) {
    super({
      ...props,
      tags: props.tags ?? [],
      specialites: props.specialites ?? [],
      image: props.image ?? ""
    });
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get titre(): string {
    return this.props.titre;
  }

  get contenu(): JSON {
    return this.props.contenu
      ? this.props.contenu.length > 0
        ? this.props.contenu[0]
        : JSON.parse("{}")
      : JSON.parse("{}");
  }

  get published(): boolean {
    return this.props.published;
  }

  get image(): string {
    return this.props.image!;
  }

  get views(): number {
    return this.props.views;
  }

  get authorId(): string {
    return this.props.authorId;
  }

  get tags(): TagProps[] {
    return this.props.tags!;
  }

  get specialites(): SpecialiteProps[] {
    return this.props.specialites!;
  }

  addTag(tag: TagProps): void {
    this.props.tags = [...(this.props.tags ?? []), tag];
  }

  removeTag(tagId: string): void {
    this.props.tags = this.props.tags?.filter((t) => t.id !== tagId) ?? [];
  }

  addSpecialite(spec: SpecialiteProps): void {
    this.props.specialites = [...(this.props.specialites ?? []), spec];
  }

  removeSpecialite(specId: string): void {
    this.props.specialites =
      this.props.specialites?.filter((s) => s.id !== specId) ?? [];
  }
}
