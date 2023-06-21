import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async PUT(req, res) {
    const categoryIdListRanked = req.body as string[];

    for await (const categoryId of categoryIdListRanked) {
      await prismaClient.category.update({
        where: {
          id: categoryId,
        },
        data: {
          rank: categoryIdListRanked.indexOf(categoryId) + 1,
        },
      });
    }

    res.send(null);
  },
});
