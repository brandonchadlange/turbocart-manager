import { Listing, ListingVariant } from "@prisma/client";
import axios from "axios";

export function makeCreateListing(props: {
  onSuccess(product: Listing): void;
  onUnexpectedError(response: any): void;
}) {
  return async function createListing(data: {
    name: string;
    description: string;
    price: number;
  }) {
    try {
      const response = await axios.post<Listing>(`/api/listing`, {
        name: data.name,
        description: data.description,
        priceInCents: data.price * 100,
      });

      props.onSuccess(response.data);
    } catch (err: any) {
      props.onUnexpectedError(err.response);
    }
  };
}

export function makeUpdateListingDetail(props: {
  onSuccess(product: Listing): void;
  onUnexpectedError(response: any): void;
}) {
  return async function updateListingDetail(data: {
    listingId: string;
    name: string;
    description: string;
    price: number;
    published: boolean;
  }) {
    try {
      const response = await axios.put(`/api/listing/${data.listingId}`, {
        name: data.name,
        description: data.description,
        priceInCents: data.price * 100,
        published: data.published,
      });

      props.onSuccess(response.data);
    } catch (err: any) {
      props.onUnexpectedError(err.response);
    }
  };
}

export function makeDeleteListing(props: {
  onSuccess(product: Listing): void;
  onUnexpectedError(response: any): void;
}) {
  return async function deleteListing(listingId: string) {
    try {
      const response = await axios.delete(`/api/listing/${listingId}`);

      props.onSuccess(response.data);
    } catch (err: any) {
      props.onUnexpectedError(err.response);
    }
  };
}

export function makeDeleteListingVariant(props: {
  onSuccess(): void;
  onUnexpectedError(response: any): void;
}) {
  return async function deleteListing(listingId: string, variantId: string) {
    try {
      const response = await axios.delete(
        `/api/listing/${listingId}/variant?variantId=${variantId}`
      );

      props.onSuccess();
    } catch (err: any) {
      props.onUnexpectedError(err.response);
    }
  };
}
