"use client";

import { BaseModel } from "./baseModel";
import { TeamMemberProps } from "./props";

export class TeamMember extends BaseModel<TeamMemberProps> {
  constructor(props: TeamMemberProps) {
    super({ ...props });
  }

  private static normalizeExternalUrl(input: string | null | undefined): string | null {
    if (!input) return null;
    let s = input.trim();
    if (!s) return null;

    s = s.replace(/^https:\/\/https\/+/i, "https://");
    s = s.replace(/^https:\/\/http\/+/i, "http://");
    s = s.replace(/^https\/+/i, "https://");
    s = s.replace(/^http\/+/i, "http://");
    s = s.replace(/^https:\/*/i, "https://");
    s = s.replace(/^http:\/*/i, "http://");

    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) {
      s = `https://${s}`;
    }

    try {
      const url = new URL(s);
      const host = url.hostname.toLowerCase();
      if (host === "linkedin" || host === "www.linkedin") {
        const path = url.pathname.replace(/^\/+/, "").replace(/\/+$/, "") || "";
        const normalizedPath =
          path.startsWith("in/") || path.startsWith("company/") || path.startsWith("school/")
            ? `/${path}`
            : path
              ? `/in/${path}`
              : "/in/";
        return `https://www.linkedin.com${normalizedPath}`;
      }
    } catch {
      // noop
    }

    return s;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get nom(): string {
    return this.props.nom;
  }

  get prenom(): string {
    return this.props.prenom;
  }

  get post(): string {
    return this.props.post;
  }

  get imageKey(): string | null | undefined {
    return this.props.imageKey;
  }

  get linkedin(): string | null | undefined {
    return this.props.linkedin;
  }

  get twitter(): string | null | undefined {
    return this.props.twitter;
  }

  get facebook(): string | null | undefined {
    return this.props.facebook;
  }

  get instagram(): string | null | undefined {
    return this.props.instagram;
  }

  get website(): string | null | undefined {
    return this.props.website;
  }

  get order(): number {
    return this.props.order ?? 0;
  }

  /** Liens sociaux renseignés (nom du réseau -> URL) pour affichage */
  get socialLinks(): { label: string; url: string }[] {
    const links: { label: string; url: string }[] = [];
    const linkedin = TeamMember.normalizeExternalUrl(this.props.linkedin);
    const twitter = TeamMember.normalizeExternalUrl(this.props.twitter);
    const facebook = TeamMember.normalizeExternalUrl(this.props.facebook);
    const instagram = TeamMember.normalizeExternalUrl(this.props.instagram);
    const website = TeamMember.normalizeExternalUrl(this.props.website);
    if (linkedin) links.push({ label: "LinkedIn", url: linkedin });
    if (twitter) links.push({ label: "Twitter", url: twitter });
    if (facebook) links.push({ label: "Facebook", url: facebook });
    if (instagram) links.push({ label: "Instagram", url: instagram });
    if (website) links.push({ label: "Site web", url: website });
    return links;
  }
}
