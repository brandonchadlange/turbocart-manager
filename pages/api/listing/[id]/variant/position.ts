import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async PUT(req, res) {
    const newOrderIdList = req.body as string[];

    for (const variantId of newOrderIdList) {
      await prismaClient.listingVariant.update({
        where: {
          id: variantId,
        },
        data: {
          position: newOrderIdList.indexOf(variantId) + 1,
        },
      });
    }

    res.send(true);
  },
});
