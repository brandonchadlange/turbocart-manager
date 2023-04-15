import axios from "axios";

const fetchMenus = async () => {
  const response = await axios.get<MenuListItem[]>(
    "http://localhost:3000/api/menu"
  );
  return response.data;
};

const menuService = {
  fetchMenus,
};

export default menuService;
