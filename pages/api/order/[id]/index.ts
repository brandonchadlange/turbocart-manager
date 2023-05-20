import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";

export default RouteHandler({
  async GET(req, res) {
    const orderId = req.query.id as string;
    const { orgSlug } = getAuth(req);

    const menuList = await prismaClient.menu.findMany({
      where: {
        merchantId: orgSlug!,
      },
    });

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
      orderItem.OrderBatch.menu = menuList.find(
        (e) => e.id === orderItem.OrderBatch.menuId
      );

      orderItem.product = variantsWithListing.find(
        (variant) => variant.id === orderItem.variantId
      );
    });

    res.send(order);
  },
});
