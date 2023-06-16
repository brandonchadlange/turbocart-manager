import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { HttpStatusCode } from "axios";

export default RouteHandler({
  async PUT(req, res) {
    const listingVariantId = req.query.id as string;

    await prismaClient.listingVariant.update({
      where: {
        id: listingVariantId,
      },
      data: {
        name: req.body.name,
        additionalFeeInCents: req.body.additionalFeeInCents,
      },
    });

    res.status(HttpStatusCode.Ok).send(true);
  },
});
