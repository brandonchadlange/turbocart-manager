import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async PUT(req, res) {
    const batchId = req.query.id as string;

    const batch = await prismaClient.orderBatch.findFirst({
      where: {
        id: batchId,
      },
      include: {
        Order: true,
      },
    });

    await prismaClient.orderBatch.update({
      where: {
        id: batchId,
      },
      data: {
        fulfilled: true,
      },
    });

    const completeBatches = batch!.Order.completeBatches + 1;
    const isComplete = completeBatches === batch!.Order.totalBatches;

    await prismaClient.order.update({
      where: {
        id: batch!.orderId,
      },
      data: {
        completeBatches,
        isComplete,
      },
    });

    res.status(200).send(true);
  },
});
