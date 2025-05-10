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

  /** Exemple de méthode métier : changer le nom */
  setName(name: string): void {
    this.props = { ...this.props, name: name };
  }

  /** Exemple de méthode métier : changer l'email */
  setEmail(email: string): void {
    this.props = { ...this.props, email: email };
  }

  /** Exemple de méthode métier : changer l'avatar */
  setAvatarUrl(avatarUrl: string): void {
    this.props = { ...this.props, avatarUrl: avatarUrl };
  }

}
