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
          const data = req.body.data as any;

          await prismaClient.merchant.create({
            data: {
              id: data.slug,
              name: data.name,
              clerkId: data.id,
            },
          });
        }
        break;
      case "organization.updated":
        {
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
