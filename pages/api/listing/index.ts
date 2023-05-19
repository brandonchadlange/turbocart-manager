import prismaClient from "@/backend/db";
import ListingService from "@/backend/services/listing";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";
import { HttpStatusCode } from "axios";

export default RouteHandler({
  async GET(req, res) {
    const { orgSlug } = getAuth(req);

    if (orgSlug === undefined || orgSlug === null) {
      return res.status(500).send("Could not determine merchant");
    }

    const listingService = new ListingService(orgSlug);
    const listings = await listingService.getAll();

    res.send(listings);
  },
  async POST(req, res) {
    const { orgSlug } = getAuth(req);
    const { linkedProducts, ...details } = req.body;

    if (orgSlug === undefined || orgSlug === null) {
      return res.status(500).send("Could not determine merchant");
    }

    const listingService = new ListingService(orgSlug);

    const newListing = await listingService.create(details);

    await prismaClient.listingVariant.create({
      data: {
        name: details.name,
        listingId: newListing.id,
        isDefault: true,
      },
    });

    res.status(HttpStatusCode.Created).send(newListing);
  },
});
