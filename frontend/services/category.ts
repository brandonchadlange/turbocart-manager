import axios from "axios";

const fetchCategories = async () => {
  const response = await axios.get<CategoryListItem[]>(
    "http://localhost:3000/api/category"
  );
  return response.data;
};

const categoryService = {
  fetchCategories,
};

export default categoryService;
