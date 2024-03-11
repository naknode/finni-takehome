import fastify, { FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const fastifyServer = fastify();

fastifyServer.get("/patients", async (req, res) => {
  const patients = await prisma.patient.findMany({
    include: { additionalFields: true, addresses: true },
  });
  res.send(patients);
});

interface RequestParamsUpdate {
  uuid: string;
}

fastifyServer.patch(
  "/patients/:uuid",
  async (req: FastifyRequest<{ Params: RequestParamsUpdate }>, res) => {
    const { uuid } = req.params;
    const updateData = req.body;

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

fastifyServer
  .listen({ port: 3000 })
  .then((address: string) =>
    console.log(`Fastify server listening on ${address}`)
  )
  .catch((err: Error) => {
    console.log("Error starting server:", err);
    process.exit(1);
  });
