import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

type ClerkOrgEvent =
  | "organization.created"
  | "organization.updated"
  | "organization.deleted";

export default RouteHandler({
  async POST(req, res) {
    const event = req.body.type as ClerkOrgEvent;

    switch (event) {
      case "organization.created":
        {
          console.log("Organization Created");

          const data = req.body.data as any;

          await prismaClient.merchant.create({
            data: {
              id: data.slug,
              name: data.name,
              clerkId: data.id,
              yocoPrivateKey: "",
              yocoPublicKey: "",
            },
          });
        }
        break;
      case "organization.updated":
        {
          console.log("Organization Updated");

          const data = req.body.data as any;

          await prismaClient.merchant.update({
            where: {
              id: data.slug,
            },
            data: {
              name: data.name,
            },
          });
        }
        break;
      case "organization.deleted":
        {
          console.log("Organization Deleted");

          const data = req.body.data as any;

          await prismaClient.merchant.deleteMany({
            where: {
              clerkId: data.id,
            },
          });
        }
        break;
    }

    res.status(200).send(true);
  },
});
