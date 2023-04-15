import TableComponent, { DataTableColumn } from "@/components/data-table/table";
import DateFormat from "@/components/date";
import ApplicationLayout from "@/components/layouts/application";
import { Text } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const fetchOrder = async (orderId: string) => {
  const response = await axios.get("/api/order/" + orderId);
  return response.data;
};

const OrderDetails = () => {
  const router = useRouter();
  const orderId = router.query.id as string;
  const orderQuery = useQuery(
    ["order-data", orderId],
    () => fetchOrder(orderId),
    {
      enabled: orderId !== undefined,
    }
  );

  const order = orderQuery.data;

  const columns: DataTableColumn<any>[] = [
    {
      heading: "Item",
      component: (row) => row.id,
    },
  ];

  return (
    <ApplicationLayout>
      {orderQuery.isLoading && <Text>Loading...</Text>}
      {!orderQuery.isLoading && (
        <>
          <h1>Order details</h1>
          <Text>
            Customer: {order?.customerFirstName} {order?.customerLastName}
          </Text>
          <Text>
            Date: <DateFormat>{order?.createdAt}</DateFormat>
          </Text>
          <TableComponent columns={columns} data={order?.OrderItem || []} />
        </>
      )}
    </ApplicationLayout>
  );
};

export default OrderDetails;
