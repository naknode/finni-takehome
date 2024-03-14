import fastify, { FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { Patient } from "shared/types";

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

fastifyServer.patch(
  "/patients/:uuid",
  async (req: FastifyRequest<{ Params: PatientWithUuidOnly }>, res) => {
    const { uuid } = req.params;
    const updateData = req.body as Patient;

    try {
      const updatedPatient = await prisma.patient.update({
        where: {
          uuid,
        },
        data: updateData,
      });

      res.send(updatedPatient);
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
      const deletedPatient = await prisma.patient.delete({
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

fastifyServer
  .listen({ port: 3000 })
  .then((address: string) =>
    console.log(`Fastify server listening on ${address}`)
  )
  .catch((err: Error) => {
    console.log("Error starting server:", err);
    process.exit(1);
  });
