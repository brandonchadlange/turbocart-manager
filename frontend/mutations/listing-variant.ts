import axios from "axios";

export function makeUpdateListingVariantEnabled(props: {
  onSuccess(product: any): void;
  onUnexpectedError(response: any): void;
}) {
  return async function updateListingVariantEnabled(data: {
    listingVariantId: string;
    enabled: boolean;
  }) {
    try {
      const response = await axios.put<any>(
        `/api/listing-variant/${data.listingVariantId}/enabled`,
        {
          enabled: data.enabled,
        }
      );

      props.onSuccess(response.data);
    } catch (err: any) {
      props.onUnexpectedError(err.response);
    }
  };
}
