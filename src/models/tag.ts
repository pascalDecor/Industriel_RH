"use client";

import { Article } from "./article";
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

  get libelle_en(): string | undefined {
    return this.props.libelle_en;
  }

  get articles(): Article[] {
    return this.props.articles?.map((a) => new Article(a)) ?? [];
  }

  get articleCount(): number {
    return this.props._count?.articles ?? 0;
  }
}
