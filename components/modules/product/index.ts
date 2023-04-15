import prismaClient from "@/backend/db";

type ProductDetails = {};

class Product {
  private details: any;

  attributes: ProductAttributes;

  constructor() {
    this.attributes = new ProductAttributes("");
  }
}

class ProductAttributes {
  private optionMap = new Map();

  constructor(attributesString: string) {
    const attributesObject = JSON.parse(attributesString);

    for (const [key, value] of Object.entries(attributesObject)) {
      this.optionMap.set(key, value);
    }
  }

  get(attributeKey: string) {
    return this.optionMap.get(attributeKey);
  }

  add(attributeKey: string) {
    this.optionMap.set(attributeKey, []);
  }

  remove(attributeKey: string) {
    this.optionMap.delete(attributeKey);
  }
}

const product = new Product();

async function getProductVariants() {
  const productVariantAttributes = prismaClient.variantAttribute.findMany({
    where: {
      variant: {
        productId: "",
      },
    },
    select: {},
  });
}

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
