
"use client";

import { userAvatarURL } from "@/constant/api";
import { BaseModel } from "./baseModel";
import { UserProps } from "./props";
import { UserRole } from "@/types/auth";

export class User extends BaseModel<UserProps> {
  constructor(props: UserProps) {
    // Fournit un avatar par défaut si manquant
    super({
      ...props,
      avatarUrl:
        props.avatarUrl ??
        userAvatarURL,
    });
  }
  
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get lastLogin(): Date | undefined {
    return this.props.lastLogin;
  }

  get avatarUrl(): string {
    return this.props.avatarUrl!;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
