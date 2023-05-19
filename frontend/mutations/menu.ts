import axios from "axios";

export async function updateMenuCategories(
  menuId: string,
  categories: string[]
) {
  await axios.put(`/api/menu/${menuId}/category`, categories);
}
