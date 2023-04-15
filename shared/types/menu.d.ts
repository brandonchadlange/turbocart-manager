declare type CreateMenuRequest = {
  name: string;
  description: string;
};

declare type MenuListItem = {
  id: string;
  name: string;
  description: string;
};

declare type MenuStructure = {
  category: CategoryListItem;
  items: ListingItem[];
};
