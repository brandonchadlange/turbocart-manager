import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import products from "@/backend/data/products";
import { getAuth } from "@clerk/nextjs/server";

export default RouteHandler({
  async GET(req, res) {
    const { orgSlug } = getAuth(req);
    const date = req.query.date as string;
    const period = req.query.period as string;

    const reportKey = req.query.key;
    const data = await getProductUtilizationReport(date, period, orgSlug!);
    res.send(data);
  },
});

const getProductUtilizationReport = async (
  dateId: string,
  menuId: string,
  orgSlug: string
) => {
  const response: any[] = [];

  const productsPerDay = await prismaClient.orderItem.groupBy({
    by: ["productId"],
    _count: {
      quantity: true,
    },
    orderBy: {
      _count: {
        quantity: "asc",
      },
    },
    where: {
      order: {
        merchantId: orgSlug,
      },
      OrderBatch: {
        dateId,
        menuId,
      },
    },
  });

  productsPerDay.forEach((e) => {
    const product = products.find((p) => p.id === e.productId)!;

    if (product.recipe.length > 0) {
      product.recipe.forEach((rp) => {
        var item = response.find((e) => e.product.id === rp.id);

        if (item === undefined || item === null) {
          response.push({
            product: rp,
            quantity: 0,
          });

          item = response[response.length - 1];
        }

        item.quantity += e._count.quantity;
      });
    } else {
      response.push({
        product,
        quantity: e._count.quantity,
      });
    }
  });

  return response;
};
