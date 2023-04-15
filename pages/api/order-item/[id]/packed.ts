import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async PUT(req, res) {
    const orderItemId = req.query.id as string;

    await prismaClient.orderItem.update({
      where: {
        id: orderItemId,
      },
      data: {
        packed: req.body.packed,
      },
    });

    res.status(200).send(true);
  },
});
