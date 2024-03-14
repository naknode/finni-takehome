-- CreateEnum
CREATE TYPE "Status" AS ENUM ('inquiry', 'onboarding', 'active', 'churned');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('number', 'string');

-- CreateTable
CREATE TABLE "Patient" (
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Address" (
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "patientUuid" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "AdditionalField" (
    "uuid" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "value" TEXT NOT NULL,
    "patientUuid" TEXT NOT NULL,

    CONSTRAINT "AdditionalField_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_patientUuid_fkey" FOREIGN KEY ("patientUuid") REFERENCES "Patient"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalField" ADD CONSTRAINT "AdditionalField_patientUuid_fkey" FOREIGN KEY ("patientUuid") REFERENCES "Patient"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
