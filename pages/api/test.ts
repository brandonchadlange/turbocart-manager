import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async GET(req, res) {
    const variantAttributes = await prismaClient.attribute.findMany({
      where: {
        variantAttributes: {
          every: {
            variant: {
              productId: "clgdfrjje00091wr8ys9izlfy",
            },
          },
        },
      },
      include: {
        values: true,
      },
    });

    const variant = await prismaClient.variant.findMany({
      where: {
        productId: "clgdhlpy9000q1wr8e53ffmrc",
        variantAttributes: {
          every: {
            attributeValueId: {
              in: [],
            },
          },
        },
      },
      include: {
        variantAttributes: {
          include: {
            attribute: true,
            attributeValue: true,
          },
        },
      },
    });

    res.send(variant);
  },
});

// const products = prismaClient.product.findMany({
//   include: {
//     variants: {
//       include: {
//         productVariantDetails: {
//           include: {},
//         },
//       },
//     },
//   },
// });

// const product = prismaClient.product.findFirst({
//   where: {
//     id: "asdf",
//   },
//   include: {
//     variants: {
//       include: {
//         productVariantDetails: {
//           include: {},
//         },
//       },
//     },
//   },
// });

// const productVariations = prismaClient.variantValue.findMany({
//   where: {
//     productVariantDetails: {
//       every: {
//         productVariant: {
//           productId: "asdf",
//         },
//       },
//     },
//   },
// });

// const productVariations2 = prismaClient.variant.findMany({
//   where: {
//     variantValues: {
//       every: {
//         productVariantDetails: {
//           every: {
//             productVariant: {
//               productId: "ASDF",
//             },
//           },
//         },
//       },
//     },
//   },
//   include: {
//     variantValues: true,
//   },
// });
