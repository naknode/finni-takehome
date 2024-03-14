export enum Status {
  Inquiry = "inquiry",
  Onboarding = "onboarding",
  Active = "active",
  Churned = "churned",
}

export enum FieldType {
  Number = "number",
  String = "string",
}

export type Patient = {
  uuid?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  status: Status;
  addresses: Address[];
  additionalFields: AdditionalField[];
};

export type Address = {
  uuid?: string;
  toDelete?: boolean;
  streetAddress: string;
  state: string;
  zip: string;
  city: string;
  country: string;
  patientUuid?: string;
};

export type AdditionalField = {
  uuid?: string;
  toDelete?: boolean;
  type: FieldType;
  value: string;
  label: string;
  patientUuid?: string;
};
