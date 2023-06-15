import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";

export default RouteHandler({
  async GET(req, res) {
    const { orgSlug } = getAuth(req);
    const providerKey = req.query.providerKey as string;

    const paymentMethod = await prismaClient.paymentMethod.findFirst({
      where: {
        merchantId: orgSlug!,
        provider: providerKey,
      },
    });

    if (paymentMethod === null) {
      return res.status(404).send(null);
    }

    res.send(paymentMethod);
  },
  async POST(req, res) {
    const { orgSlug } = getAuth(req);
    const providerKey = req.query.providerKey as string;

    const paymentMethod = await prismaClient.paymentMethod.findFirst({
      where: {
        merchantId: orgSlug!,
        provider: providerKey,
      },
    });

    if (paymentMethod === null) {
      await prismaClient.paymentMethod.create({
        data: {
          provider: providerKey,
          configuration: req.body.configuration,
          description: "",
          name: "",
          enabled: true,
          merchantId: orgSlug!,
        },
      });

      return res.status(201).send(true);
    }

    await prismaClient.paymentMethod.update({
      where: {
        id: paymentMethod.id,
      },
      data: {
        configuration: req.body.configuration,
      },
    });

    res.status(200).send(true);
  },
});
