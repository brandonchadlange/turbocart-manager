import products from "@/backend/data/products";
import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";

export default RouteHandler({
  async GET(req, res) {
    const { orgSlug } = getAuth(req);
    const dateId = req.query.date as string;
    const menuId = req.query.period as string;
    const search = req.query.search as string;

    const batches = (await prismaClient.orderBatch.findMany({
      orderBy: {
        dateId: "asc",
      },
      include: {
        Order: true,
        OrderItem: true,
      },
      where: {
        Order: {
          merchantId: orgSlug!,
        },
        dateId: dateId,
        menuId: menuId,
        AND: {
          orderId: {
            contains: search,
          },
        },
      },
    })) as any[];

    batches.forEach((batch) => {
      batch.OrderItem.forEach((orderItem: any) => {
        orderItem.product = products.find(
          (e: any) => e.id === orderItem.productId
        );
      });
    });

    res.send(batches);
  },
});
