// BaseModel générique pour gestion uniforme des entités
export abstract class BaseModel<Props extends { id: string }> {
  protected props: Props;

  constructor(props: Props) {
    this.props = { ...props };
  }

  /** Retourne l'objet brut (pour JSON, Prisma, etc.) */
  toJSON(): Props {
    return { ...this.props };
  }

  /** Crée une instance à partir d'un plain object */
  static fromJSON<Instance extends BaseModel<any>, Props>(
    this: new (props: Props) => Instance,
    data: Props
  ): Instance {
    return new this(data);
  }

  /** Identifiant unique */
  get id(): string {
    return this.props.id;
  }

  /** Exemple de mise à jour partielle */
  update(fields: Partial<Omit<Props, "id">>): void {
    this.props = { ...this.props, ...fields };
  }
}
