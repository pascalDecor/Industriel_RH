/* eslint-disable @typescript-eslint/no-explicit-any */

import { userAvartarURL } from "@/constant/api";
import { BaseModel } from "./baseModel";
import { UserProps } from "./props";

export class User extends BaseModel<UserProps> {
  constructor(props: UserProps) {
    // Fournit un avatar par défaut si manquant
    super({
      ...props,
      avatarUrl:
        props.avatarUrl ??
        userAvartarURL,
    });
  }
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get avatarUrl(): string {
    return this.props.avatarUrl!;
  }
}
