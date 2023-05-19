import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";
import { HttpStatusCode } from "axios";

export default RouteHandler({
  async GET(req, res) {
    const { orgSlug } = getAuth(req);

    const menuList = await prismaClient.menu.findMany({
      where: {
        merchantId: orgSlug!,
      },
    });

    res.send(menuList);
  },
  async POST(req, res) {
    const { orgSlug } = getAuth(req);

    const newMenu = await prismaClient.menu.create({
      data: {
        merchantId: orgSlug!,
        name: req.body.name,
      },
    });

    res.status(HttpStatusCode.Created).send(newMenu);
  },
});
