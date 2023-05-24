import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";

export default RouteHandler({
  async GET(req, res) {
    const { orgSlug } = getAuth(req);

    const orders = await prismaClient.order.findMany({
      where: {
        merchantId: orgSlug!,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(orders);
  },
  async POST(req, res) {},
});
