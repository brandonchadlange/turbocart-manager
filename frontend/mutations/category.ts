import axios from "axios";

export function makeUpdateListingCategories(props: {
  onSuccess(product: Listing): void;
  onUnexpectedError(response: any): void;
}) {
  return async function updateListingCategories(data: {
    listingId: string;
    categoryIdList: string[];
  }) {
    try {
      const response = await axios.put(
        `/api/listing/${data.listingId}/category`,
        data.categoryIdList
      );

      props.onSuccess(response.data);
    } catch (err: any) {
      props.onUnexpectedError(err.response);
    }
  };
}
