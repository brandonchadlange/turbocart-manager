import prismaClient from "../db";

class ListingService {
  private listingRepo: ListingRepository;

  constructor(private _merchantId: string) {
    this.listingRepo = new ListingRepository(_merchantId);
  }

  getAll() {
    return this.listingRepo.getAll();
  }

  getById(id: string) {
    return this.listingRepo.getById(id);
  }

  create(data: { name: string; description: string; priceInCents: number }) {
    return this.listingRepo.create(data);
  }

  updateListingDetail(data: {
    id: string;
    name: string;
    description: string;
    priceInCents: number;
    published: boolean;
  }) {
    return this.listingRepo.updateListingDetail(data);
  }

  deleteListing(listingId: string) {
    return this.listingRepo.deleteListing(listingId);
  }
}

export default ListingService;

class ListingRepository {
  constructor(private _merchantId: string) {}

  getAll() {
    return prismaClient.listing.findMany({
      where: {
        merchantId: this._merchantId,
      },
    });
  }

  getById(id: string) {
    return prismaClient.listing.findFirst({
      where: {
        id,
      },
    });
  }

  create(data: { name: string; description: string; priceInCents: number }) {
    return prismaClient.listing.create({
      data: {
        merchantId: this._merchantId,
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
      },
    });
  }

  updateListingDetail(data: {
    id: string;
    name: string;
    description: string;
    priceInCents: number;
    published: boolean;
  }) {
    return prismaClient.listing.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
        priceInCents: data.priceInCents,
        published: data.published,
      },
    });
  }

  deleteListing(listingId: string) {
    return prismaClient.listing.delete({
      where: {
        id: listingId,
      },
    });
  }
}
