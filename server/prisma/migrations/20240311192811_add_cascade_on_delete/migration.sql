-- DropForeignKey
ALTER TABLE "AdditionalField" DROP CONSTRAINT "AdditionalField_patientUuid_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_patientUuid_fkey";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_patientUuid_fkey" FOREIGN KEY ("patientUuid") REFERENCES "Patient"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalField" ADD CONSTRAINT "AdditionalField_patientUuid_fkey" FOREIGN KEY ("patientUuid") REFERENCES "Patient"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
