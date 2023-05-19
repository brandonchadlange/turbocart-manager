import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
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
    _sum: {
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

  const listingIdList = productsPerDay.map((e) => e.productId);

  const listings = await prismaClient.listing.findMany({
    where: {
      id: {
        in: listingIdList,
      },
    },
  });

  productsPerDay.forEach((e) => {
    const product = listings.find((p) => p.id === e.productId)!;

    response.push({
      product,
      quantity: e._sum.quantity,
    });
  });

  return response;
};
