import TableComponent, { DataTableColumn } from "@/components/data-table/table";
import DateFormat from "@/components/date";
import ApplicationLayout from "@/components/layouts/application";
import { Card, Space, Text, createStyles } from "@mantine/core";
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

  const listingName = (orderItem: any) => {
    if (orderItem.isDefault) {
      return orderItem.name;
    }

    return `${orderItem.listing.name} - ${orderItem.name}`;
  };

  const order = orderQuery.data;

  const columns: DataTableColumn<any>[] = [
    {
      heading: "Item",
      component: (row) => listingName(row.product),
    },
    {
      heading: "Student",
      component: (row) =>
        row.OrderBatch.studentFirstName + " " + row.OrderBatch.studentLastName,
    },
    {
      heading: "Grade",
      component: (row) => row.OrderBatch.studentGrade,
    },
    {
      heading: "Date",
      component: (row) => row.OrderBatch.dateId,
    },
    {
      heading: "Period",
      component: (row) => row.OrderBatch.menu.name,
    },
    {
      heading: "Qty",
      component: (row) => row.quantity,
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
          {order?.notes && (
            <Text size="sm" mt="md">
              Notes: {order?.notes}
            </Text>
          )}
          <Card withBorder mt="md" p={0}>
            <TableComponent columns={columns} data={order?.OrderItem || []} />
          </Card>
        </>
      )}
      <Space h={20} />
      {/* <OrderComments /> */}
    </ApplicationLayout>
  );
};

export default OrderDetails;
