import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const orderId = req.query.id as string;

    const order = await prismaClient.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        OrderItem: true,
      },
    });

    res.send(order);
  },
});
