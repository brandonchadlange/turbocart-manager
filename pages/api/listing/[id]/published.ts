import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async PUT(req, res) {
    const listingId = req.query.id as string;

    await prismaClient.listing.update({
      where: {
        id: listingId,
      },
      data: {
        published: req.body.published,
      },
    });

    res.send(true);
  },
});
