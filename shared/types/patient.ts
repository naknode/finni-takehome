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
  uuid: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  status: Status;
  addresses: Address[];
  additionalFields: AdditionalField[];
};

export type Address = {
  uuid: string;
  streetAddress: string;
  state: string;
  zip: string;
  city: string;
  country: string;
  patientUuid: string;
  patient: Patient;
};

export type AdditionalField = {
  uuid: string;
  type: FieldType;
  value: string;
  patientUuid: string;
  patient: Patient;
};
