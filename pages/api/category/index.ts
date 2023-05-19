import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";

export default RouteHandler({
  async GET(req, res) {
    const { orgSlug } = getAuth(req);

    const categories = await prismaClient.category.findMany({
      where: {
        merchantId: orgSlug!,
      },
    });

    res.send(categories);
  },
});
