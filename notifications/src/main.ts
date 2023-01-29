import fastify from "fastify";
import cors from "@fastify/cors";
import WebPush from "web-push";

const publicKey =
  "BKH06Aok3xNCuxHG5jgyTIjpocmN8ortz9WdnzvjOeMPLUtJfeG1I_eXQQvWXc0-p3in8_TXCYCIA2nzB-ZOKmY";
const privateKey = "YOO_XVq_jEPpKGluEddfxfse_2irmEhkavEKCpmV_9c";

WebPush.setVapidDetails("http://localhost:3333", publicKey, privateKey);

async function bootstrap() {
  const app = fastify();

  await app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });

  app.get("/push/public_key", () => {
    return {
      publicKey,
    };
  });

  app.post("/push/register", (request, reply) => {
    console.log(request.body);

    return reply.status(201).send();
  });

  app.post("/push/send", (request, reply) => {
    const { subscription } = request.body;

    if (!subscription) {
      return reply.status(422).send();
    }

    WebPush.sendNotification(subscription, "Hello, World!");

    return reply.status(201).send();
  });

  const url = await app.listen({ port: 4000, host: "0.0.0.0" });
  console.log(url);
}

bootstrap();
