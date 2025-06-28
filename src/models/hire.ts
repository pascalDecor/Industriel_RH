"use client";

import { BaseModel } from "./baseModel";
import { Civility } from "./civility";
import { HireProps, SectorProps } from "./props";

export class Hire extends BaseModel<HireProps> {
  constructor(props: HireProps) {
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

  get lastName(): string {
    return this.props.lastName;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get number_of_positions(): number {
    return this.props.number_of_positions;
  }

  get document_support(): string | undefined {
    return this.props.document_support;
  }

  get details_of_positions(): JSON {
    return this.props.details_of_positions
      ? this.props.details_of_positions.length > 0
        ? this.props.details_of_positions[0]
        : JSON.parse("{}")
      : JSON.parse("{}");
  }

  get company_name(): string {
    return this.props.company_name;
  }

  get company_website(): string | undefined {
    return this.props.company_website;
  }

  get state(): string {
    return this.props.state;
  }

  get sectors(): SectorProps[] {
    return this.props.sectors;
  }

  get civilityId(): string {
    return this.props.civilityId;
  }

  get civility(): Civility | undefined {
    return Civility.fromJSON(this.props.civility!);
  }

}
