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
        OrderItem: {
          include: {
            OrderBatch: true,
          },
        },
      },
    });

    const variantIdList = order?.OrderItem.map((e) => e.variantId);

    const variantsWithListing = await prismaClient.listingVariant.findMany({
      where: {
        id: {
          in: variantIdList,
        },
      },
      include: {
        listing: true,
      },
    });

    order?.OrderItem.forEach((orderItem: any) => {
      orderItem.product = variantsWithListing.find(
        (variant) => variant.listingId === orderItem.variantId
      );
    });

    res.send(order);
  },
});
