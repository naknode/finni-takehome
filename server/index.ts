import fastify, { FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import type { Patient, Address } from "shared/types";

const prisma = new PrismaClient();

const fastifyServer = fastify();

void fastifyServer.register(require("@fastify/cors"));

fastifyServer.get("/patients", async (req, res) => {
  const patients = await prisma.patient.findMany({
    include: { additionalFields: true, addresses: true },
  });
  res.send(patients);
});

type PatientWithUuidOnly = Pick<Patient, "uuid">;
type AddressWithUuidOnly = Pick<Address, "uuid">;

fastifyServer.patch(
  "/patients/:uuid",
  async (req: FastifyRequest<{ Params: PatientWithUuidOnly }>, res) => {
    const { uuid } = req.params;
    const { addresses, ...updateData } = req.body as Patient;

    try {
      const updatedPatient = await prisma.patient.update({
        where: { uuid },
        data: updateData,
      });

      if (addresses && addresses.length > 0) {
        const addressPromises = addresses.map(async (address) => {
          if (address.uuid) {
            return prisma.address.update({
              where: { uuid: address.uuid },
              data: { ...address, patientUuid: uuid },
            });
          } else {
            return prisma.address.create({
              data: { ...address, patientUuid: uuid },
            });
          }
        });

        await Promise.all(addressPromises);
      }

      const patientWithUpdatedAddresses = await prisma.patient.findUnique({
        where: { uuid: updatedPatient.uuid },
        include: { addresses: true },
      });

      res.send(patientWithUpdatedAddresses);
    } catch (error) {
      res
        .status(500)
        .send({ error: `Patient update failed: ${error.message}` });
    }
  }
);

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
          addresses: true,
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
