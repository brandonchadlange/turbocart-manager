import TableComponent, { DataTableColumn } from "@/components/data-table/table";
import DateFormat from "@/components/date";
import ApplicationLayout from "@/components/layouts/application";
import queries from "@/frontend/queries";
import {
  ActionIcon,
  Card,
  Flex,
  Group,
  Paper,
  ScrollArea,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
  TypographyStylesProvider,
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSend } from "@tabler/icons";
import axios from "axios";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useQuery } from "react-query";

const fetchOrder = async (orderId: string) => {
  const response = await axios.get("/api/order/" + orderId);
  return response.data;
};

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
  },

  body: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    "& > p:last-child": {
      marginBottom: 0,
    },
  },
}));

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
      component: (row) => row.productId,
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
      component: (row) => row.OrderBatch.menuId,
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
