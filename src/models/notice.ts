"use client";

import { BaseModel } from "./baseModel";
import { NoticeProps } from "./props";

export class Notice extends BaseModel<NoticeProps> {
  constructor(props: NoticeProps) {
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

  get content(): string {
    return this.props.content;
  }

  get author(): string {
    return this.props.author;
  }

  get stars(): number {
    return this.props.stars;
  }

}
