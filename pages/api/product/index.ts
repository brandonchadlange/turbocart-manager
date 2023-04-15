import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async POST(req, res) {
    const requestData = req.body;

    const newProduct = await prismaClient.product.create({
      data: {
        name: requestData.name,
      },
    });

    await prismaClient.variant.create({
      data: {
        productId: newProduct.id,
      },
    });

    res.send(newProduct);
  },
});

function getVariants(attributes: any) {
  const keys = Object.keys(attributes);
  const values = keys.map((key) => attributes[key]);
  const variants = cartesian(...values);
  return variants.map((variant: any) => {
    const result: any = {};
    for (let i = 0; i < keys.length; i++) {
      result[keys[i]] = variant[i];
    }
    return result;
  });
}

function cartesian(...arrays: any[]) {
  return arrays.reduce(
    (acc, curr) => acc.flatMap((a: any) => curr.map((c: any) => [...a, c])),
    [[]]
  );
}
