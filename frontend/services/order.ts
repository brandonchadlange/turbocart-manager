import { Order } from "@prisma/client";
import axios from "axios";

const fetchOrders = async () => {
  const response = await axios.get<Order[]>("/api/order");
  return response.data;
};

const orderService = {
  fetchOrders,
};

export default orderService;
