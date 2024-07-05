import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { HttpStatusCode } from "axios";

export default RouteHandler({
  async GET(req, res) {
    const listingId = req.query.id as string;

    const listingVariants = await prismaClient.listingVariant.findMany({
      where: {
        listingId: listingId,
        NOT: {
          isDefault: true,
        },
        deleted: false,
      },
      orderBy: {
        position: "desc",
      },
    });

    res.send(listingVariants);
  },
  async POST(req, res) {
    const listingId = req.query.id as string;

    const variantCount = await prismaClient.listingVariant.count({
      where: {
        listingId: listingId,
      },
    });

    const newVariant = await prismaClient.listingVariant.create({
      data: {
        listingId: listingId,
        isDefault: false,
        name: req.body.name,
        additionalFeeInCents: req.body.additionalFeeInCents,
        position: variantCount + 1,
      },
    });

    res.status(HttpStatusCode.Created).send(newVariant);
  },
  async DELETE(req, res) {
    const variantId = req.query.variantId as string;

    const variant = await prismaClient.listingVariant.findFirst({
      where: {
        id: variantId,
      },
      include: {
        listing: {
          include: {
            variants: true,
          },
        },
      },
    });

    if (!variant) {
      return res.status(HttpStatusCode.BadRequest).send({
        code: "VARIANT_NOT_FOUND",
        message: "Variant does not exist",
      });
    }

    await prismaClient.listingVariant.update({
      where: {
        id: variantId,
      },
      data: {
        deleted: true,
      },
    });

    res.send(true);
  },
});
