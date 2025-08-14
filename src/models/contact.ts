import { BaseModel } from "./baseModel";
import { ContactProps } from "./props";

export class Contact extends BaseModel<ContactProps> {
  constructor(props: ContactProps) {
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

  get companyName(): string | undefined {
    return this.props.companyName;
  }

  get jobTitle(): string | undefined {
    return this.props.jobTitle;
  }

  get workEmail(): string {
    return this.props.workEmail;
  }

  get workPhone(): string {
    return this.props.workPhone;
  }

  get postalCode(): string | undefined {
    return this.props.postalCode;
  }

  get message(): string {
    return this.props.message;
  }

  get status(): string {
    return this.props.status;
  }

  get priority(): string {
    return this.props.priority;
  }
}
