import prismaClient from "@/backend/db";
import CategoryService from "@/backend/services/category";
import ListingService from "@/backend/services/listing";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";

export default RouteHandler({
  async GET(req, res) {
    const { orgSlug } = getAuth(req);
    const listingId = req.query.id as string;

    if (orgSlug === undefined || orgSlug === null) {
      return res.status(500).send("Could not determine merchant");
    }

    const listingService = new ListingService(orgSlug);
    const categoryService = new CategoryService();

    const listing = await listingService.getById(listingId);
    const categories = await categoryService.getListingCategories(listingId);

    res.send({
      ...listing,
      categories,
    });
  },
  async PUT(req, res) {
    const { orgSlug } = getAuth(req);
    const listingId = req.query.id as string;

    if (orgSlug === undefined || orgSlug === null) {
      return res.status(500).send("Could not determine merchant");
    }

    const listingService = new ListingService(orgSlug);

    await listingService.updateListingDetail({
      id: listingId,
      ...req.body,
    });

    await prismaClient.listingVariant.updateMany({
      where: {
        listingId,
        isDefault: true,
      },
      data: {
        name: req.body.name,
      },
    });

    res.send(true);
  },
  async DELETE(req, res) {
    const { orgSlug } = getAuth(req);
    const listingId = req.query.id as string;

    if (orgSlug === undefined || orgSlug === null) {
      return res.status(500).send("Could not determine merchant");
    }

    const listingService = new ListingService(orgSlug);

    await listingService.deleteListing(listingId);

    res.send(true);
  },
});
