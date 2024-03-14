import fastify, { FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import type { Patient, Address, AdditionalField } from "shared/types";

const prisma = new PrismaClient();

const fastifyServer = fastify();

void fastifyServer.register(require("@fastify/cors"));

// Get all patients
fastifyServer.get("/patients", async (_, res) => {
  const patients = await prisma.patient.findMany({
    include: { additionalFields: true, addresses: true },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.send(patients);
});

type PatientWithUuidOnly = Pick<Patient, "uuid">;
type AddressWithUuidOnly = Pick<Address, "uuid">;

// Update Patient (create/update addresses and additional fields)
fastifyServer.patch(
  "/patients/:uuid",
  async (req: FastifyRequest<{ Params: PatientWithUuidOnly }>, res) => {
    const { uuid } = req.params;
    const { addresses, additionalFields, ...updateData } = req.body as Patient;

    try {
      const updatedPatient = await prisma.patient.update({
        where: { uuid },
        data: updateData,
      });

      await updateRelatedEntities(uuid, addresses, prisma.address);
      await updateRelatedEntities(
        uuid,
        additionalFields,
        prisma.additionalField
      );

      const updatedPatientWithEverything = await prisma.patient.findUnique({
        where: { uuid: updatedPatient.uuid },
        include: { addresses: true, additionalFields: true },
      });

      res.send(updatedPatientWithEverything);
    } catch (error) {
      res
        .status(500)
        .send({ error: `Patient update failed: ${error.message}` });
    }
  }
);

// Update/Create Addresses or Additional Fields
async function updateRelatedEntities(
  uuid: string,
  entities: Address | AdditionalField,
  prismaModel
) {
  if (entities && entities.length > 0) {
    const promises = entities.map(async (entity: Address | AdditionalField) => {
      if (entity.toDelete && entity.uuid) {
        return prismaModel.delete({
          where: { uuid: entity.uuid },
        });
      } else if (entity.uuid) {
        return prismaModel.update({
          where: { uuid: entity.uuid },
          data: { ...entity, patientUuid: uuid },
        });
      } else {
        return prismaModel.create({
          data: { ...entity, patientUuid: uuid },
        });
      }
    });

    await Promise.all(promises);
  }
}

// Get Patient details
fastifyServer.get(
  "/patient/:uuid",
  async (req: FastifyRequest<{ Params: PatientWithUuidOnly }>, res) => {
    const { uuid } = req.params;

    try {
      const getPatient = await prisma.patient.findUnique({
        where: {
          uuid,
        },
        include: {
          addresses: {
            orderBy: {
              createdAt: "asc",
            },
          },
          additionalFields: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      res.send(getPatient);
    } catch (error) {
      res
        .status(500)
        .send({ error: `Failed to get patient: ${error.message}` });
    }
  }
);

// Create patient
fastifyServer.post(
  "/patient",
  async (req: FastifyRequest<{ Params: PatientWithUuidOnly }>, res) => {
    const { addresses, additionalFields, ...patientData } = req.body as Patient;

    try {
      const createdPatient = await prisma.patient.create({
        data: {
          ...patientData,
          addresses: {
            create: [...addresses],
          },
          additionalFields: {
            create: [...additionalFields],
          },
        },
      });

      res.send(createdPatient);
    } catch (error) {
      res
        .status(500)
        .send({ error: `Patient create failed: ${error.message}` });
    }
  }
);

// Delete patient
fastifyServer.delete(
  "/patients/:uuid",
  async (req: FastifyRequest<{ Params: PatientWithUuidOnly }>, res) => {
    const { uuid } = req.params;

    try {
      await prisma.patient.delete({
        where: { uuid },
      });

      res.send({ message: "Patient record successfully deleted" });
    } catch (error) {
      res
        .status(500)
        .send({ error: `Failed to delete patient: ${error.message}` });
    }
  }
);

// Delete Address
fastifyServer.delete(
  "/patients/address/:uuid",
  async (req: FastifyRequest<{ Params: AddressWithUuidOnly }>, res) => {
    const { uuid } = req.params;

    try {
      await prisma.address.delete({
        where: { uuid },
      });

      res.send({ message: "Patient address successfully deleted" });
    } catch (error) {
      res
        .status(500)
        .send({ error: `Failed to delete patient address: ${error.message}` });
    }
  }
);

fastifyServer
  .listen({ port: 3000 })
  .then((address: string) =>
    console.log(`Fastify server listening on ${address}`)
  )
  .catch((err: Error) => {
    console.log("Error starting server:", err);
    process.exit(1);
  });
