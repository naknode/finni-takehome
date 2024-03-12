enum Status {
  Inquiry = "inquiry",
  Onboarding = "onboarding",
  Active = "active",
  Churned = "churned",
}

enum FieldType {
  Number = "number",
  String = "string",
}

interface Patient {
  uuid: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  status: Status;
  addresses: Address[];
  additionalFields: AdditionalField[];
}

interface Address {
  uuid: string;
  streetAddress: string;
  zip: string;
  city: string;
  country: string;
  patientUuid: string;
  patient: Patient;
}

interface AdditionalField {
  uuid: string;
  type: FieldType;
  value: string;
  patientUuid: string;
  patient: Patient;
}
