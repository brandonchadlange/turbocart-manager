import { Order } from "@prisma/client";
import axios from "axios";

const fetchOrders = async (state: string) => {
  const response = await axios.get<Order[]>("/api/order?state=" + state);
  return response.data;
};

const orderService = {
  fetchOrders,
};

export default orderService;
