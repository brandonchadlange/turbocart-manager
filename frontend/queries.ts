import { Category, Listing, Menu } from "@prisma/client";
import axios from "axios";
import Module from "module";

const applyFetch = <RES = any>(url: string) => {
  return async () => {
    const response = await axios.request<RES>({
      method: "GET",
      url,
    });

    return response.data;
  };
};

const queries = {
  fetchModules: applyFetch<Module[]>("/api/module"),
  fetchListings: applyFetch<Listing[]>("/api/listing"),
  fetchListingProducts: (listingId: string) =>
    applyFetch<string[]>(`/api/listing/${listingId}/product`)(),
  fetchListing: (listingId: string) =>
    applyFetch<ListingDetail>("/api/listing/" + listingId)(),
  fetchMenus: applyFetch<Menu[]>("/api/menu"),
  fetchMenuCategories: (menuId: string) =>
    applyFetch<Menu[]>(`/api/menu/${menuId}/category`)(),
  fetchCategories: applyFetch<Category[]>("/api/category"),
  fetchProductCategories: (productId: string) =>
    applyFetch<Category[]>(`/api/product/${productId}/category`)(),
};

export default queries;
