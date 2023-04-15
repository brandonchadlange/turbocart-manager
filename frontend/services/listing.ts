import axios from "axios";
import useServiceHelper from "../helpers/service-helper";

const createListing = (data: CreateListingRequest) => {
  return useServiceHelper({
    async request() {
      try {
        await axios.post<ListingItem>(
          "http://localhost:3000/api/listing",
          data
        );
      } catch (err) {
        console.log(err);
      }
    },
  });
};

const listingService = {
  createListing,
};

export default listingService;
