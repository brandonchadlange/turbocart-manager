import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";
import { HttpStatusCode } from "axios";

export default RouteHandler({
  async GET(req, res) {
    const { orgSlug } = getAuth(req);

    const categories = await prismaClient.category.findMany({
      where: {
        merchantId: orgSlug!,
      },
      orderBy: {
        rank: "asc",
      },
    });

    res.send(categories);
  },
  async POST(req, res) {
    const { orgSlug } = getAuth(req);

    const merchantCategoryCount = await prismaClient.category.count({
      where: {
        merchantId: orgSlug!,
      },
    });

    await prismaClient.category.create({
      data: {
        merchantId: orgSlug!,
        name: req.body.name,
        rank: merchantCategoryCount + 1,
      },
    });

    res.status(HttpStatusCode.Created).send(null);
  },
});
