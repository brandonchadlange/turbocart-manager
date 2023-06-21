import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async PUT(req, res) {
    const categoryId = req.query.id as string;

    await prismaClient.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: req.body.name,
      },
    });

    res.send(null);
  },
});
