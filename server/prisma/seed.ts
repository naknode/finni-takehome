import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const numberOfPatients = 100;

  for (let i = 0; i < numberOfPatients; i++) {
    const patientUuid = faker.string.uuid();

    await prisma.patient.create({
      data: {
        uuid: patientUuid,
        firstName: faker.person.firstName(),
        middleName: faker.datatype.boolean() ? faker.person.firstName() : null,
        lastName: faker.person.lastName(),
        dateOfBirth: faker.date.birthdate(),
        status: faker.helpers.arrayElement([
          "inquiry",
          "onboarding",
          "active",
          "churned",
        ]),
        addresses: {
          create: [
            {
              uuid: faker.string.uuid(),
              streetAddress: faker.location.streetAddress(),
              zip: faker.location.zipCode(),
              city: faker.location.city(),
              country: faker.location.country(),
            },
          ],
        },
        additionalFields: {
          create: [
            {
              uuid: faker.string.uuid(),
              type: faker.helpers.arrayElement(["number", "string"]),
              value: faker.lorem.words(2),
            },
          ],
        },
      },
    });
  }

  console.log(
    `${numberOfPatients} patients with their addresses and additional fields created.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
