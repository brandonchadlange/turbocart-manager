declare type CreateListingRequest = {
  name: string;
  description: string;
  price: number;
  selectedMenus: string[];
  selectedCategories: string[];
};

declare type ListingItem = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  menus: string[];
};

declare type ListingListResponse = ListResponse<ListingItem>;
