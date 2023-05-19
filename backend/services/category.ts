import prismaClient from "../db";

class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  async getListingCategories(listingId: string) {
    const listingCategories = await this.categoryRepo.getListingCategories(
      listingId
    );
    return listingCategories.map((listingCategory) => listingCategory.category);
  }

  async updateListingCategories(listingId: string, categoryIdList: string[]) {
    await this.categoryRepo.deleteListingCategories(listingId);
    await this.categoryRepo.createListingCategories(listingId, categoryIdList);
  }
}

export default CategoryService;

class CategoryRepository {
  constructor() {}

  getListingCategories(listingId: string) {
    return prismaClient.listingCategory.findMany({
      where: {
        listingId,
      },
      include: {
        category: true,
      },
    });
  }

  createListingCategories(listingId: string, categoryIdList: string[]) {
    return prismaClient.listingCategory.createMany({
      data: categoryIdList.map((categoryId, idx) => ({
        listingId,
        categoryId,
        rank: idx + 1,
      })),
    });
  }

  deleteListingCategories(listingId: string) {
    return prismaClient.listingCategory.deleteMany({
      where: {
        listingId,
      },
    });
  }
}
