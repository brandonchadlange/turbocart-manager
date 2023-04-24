import products from "@/backend/data/products";
import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const orderId = req.query.id as string;

    const order = (await prismaClient.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        OrderItem: {
          include: {
            OrderBatch: true,
          },
        },
      },
    })) as any;

    order?.OrderItem.forEach((orderItem: any) => {
      orderItem.product = products.find(
        (product) => orderItem.productId === product.id
      );
    });

    res.send(order);
  },
});
