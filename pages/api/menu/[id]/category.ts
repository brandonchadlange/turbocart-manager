import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const menuId = req.query.id as string;

    const menuCategories = await prismaClient.menuCategory.findMany({
      where: {
        menuId,
      },
      select: {
        category: true,
      },
    });

    const response = await menuCategories.map((e) => e.category);

    res.send(response);
  },
  async PUT(req, res) {
    const menuId = req.query.id as string;
    const categoryIdList = req.body as string[];

    await prismaClient.menuCategory.deleteMany({
      where: {
        menuId,
      },
    });

    await prismaClient.menuCategory.createMany({
      data: categoryIdList.map((categoryId, idx) => ({
        categoryId,
        menuId,
        rank: idx + 1,
      })),
    });

    res.send(true);
  },
});
