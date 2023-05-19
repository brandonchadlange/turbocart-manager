declare type Attribute = {
  id: string;
  name: string;
};

declare type AttributeValue = {
  id: string;
  attributeId: string;
  value: string;
};

declare type Listing = {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  priceInCents: number;
  published: boolean;
};

declare type Category = {
  id: string;
  name: string;
};

declare type ListingDetail = Listing & {
  attributes: (Attribute & {
    values: AttributeValue[];
  })[];
  categories: Category[];
};
