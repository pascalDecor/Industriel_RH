import { BaseModel } from "./baseModel";
import { City } from "./city";
import { Civility } from "./civility";
import { Fonction } from "./fonction";
import { ApplicationProps } from "./props";
import { Sector } from "./sector";

export class Application extends BaseModel<ApplicationProps> {
  constructor(props: ApplicationProps) {
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

  get adresse(): string {
    return this.props.adresse;
  }

  get cv(): string {
    return this.props.cv;
  }

  get coverLetter(): string | undefined {
    return this.props.coverLetter;
  }

  get state(): string {
    return this.props.state;
  }

  get year_of_experience(): number {
    return this.props.year_of_experience;
  }

  get sectorId(): string {
    return this.props.sectorId;
  }

  get functionId(): string {
    return this.props.functionId;
  }

  get civilityId(): string {
    return this.props.civilityId;
  }

  get cityId(): string {
    return this.props.cityId;
  }

  get sector(): Sector | undefined {
    return Sector.fromJSON(this.props.sector!);
  }

  get function(): Fonction | undefined {
    return Fonction.fromJSON(this.props.function!);
  }

  get civility(): Civility | undefined {
    return Civility.fromJSON(this.props.civility!);
  }

  get city(): City | undefined {
    return City.fromJSON(this.props.city!);
  }

}
