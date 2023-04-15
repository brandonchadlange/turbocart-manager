import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

export default RouteHandler({
  async GET(req, res) {
    const { userId, orgId } = getAuth(req);

    const levels = await prismaClient.hierachyLevel.findMany({
      where: {
        id: {
          not: "root",
        },
      },
      orderBy: {
        level: "asc",
      },
    });

    res.send(levels);
  },
  async POST(req, res) {
    const highestLevel = await prismaClient.hierachyLevel.findFirst({
      orderBy: {
        level: "desc",
      },
    });

    const newLevel = await prismaClient.hierachyLevel.create({
      data: {
        level: highestLevel ? highestLevel.level + 1 : 1,
        name: req.body.name,
      },
    });

    res.send(newLevel);
  },
});
