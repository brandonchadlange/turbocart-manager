import prismaClient from "@/backend/db";
import CategoryService from "@/backend/services/category";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async PUT(req, res) {
    const listingId = req.query.id as string;
    const categoryIdList = req.body as string[];

    const categoryService = new CategoryService();
    await categoryService.updateListingCategories(listingId, categoryIdList);

    res.send(true);
  },
});
