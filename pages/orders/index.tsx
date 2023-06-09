import { DataTableColumn } from "@/components/data-table";
import TableComponent from "@/components/data-table/table";
import ApplicationLayout from "@/components/layouts/application";
import Money from "@/components/money";
import orderService from "@/frontend/services/order";
import { useOrganization } from "@clerk/nextjs";
import { Anchor, Card, Space, Tabs } from "@mantine/core";
import { Order } from "@prisma/client";
import { DateTime } from "luxon";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";

const OrdersList = (props: { orderState: string }) => {
  const { organization, isLoaded } = useOrganization();

  const OrderTableColumns: DataTableColumn<Order>[] = [
    {
      heading: "Order Id",
      component: (row) => (
        <Anchor component={Link} href={`/orders/${row.id}`}>
          {row.id}
        </Anchor>
      ),
    },
    {
      heading: "Order date",
      component: (row) =>
        DateTime.fromJSDate(new Date(row.createdAt)).toLocaleString({
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
    },
    {
      heading: "Value",
      component: (row) => <Money currency="ZAR">{row.totalInCents}</Money>,
    },
    {
      heading: "Batches complete",
      component: (row) => `${row.completeBatches}/${row.totalBatches}`,
    },
    {
      heading: "Quantity",
      component: (row) => row.quantity,
    },
  ];

  const ordersQuery = useQuery(
    ["order-list", organization, props.orderState],
    () => orderService.fetchOrders(props.orderState),
    {
      enabled: isLoaded,
      initialData: [],
      refetchInterval: 20000,
    }
  );

  const tableData = ordersQuery.data || [];

  return <TableComponent columns={OrderTableColumns} data={tableData!} />;
};

const OrdersPage = () => {
  const [orderState, setOrderState] = useState<string | null>("open");

  return (
    <ApplicationLayout>
      <h1>Orders</h1>
      <Space h={20} />
      <Tabs value={orderState} onTabChange={setOrderState} mb="md">
        <Tabs.List>
          <Tabs.Tab value="open">Open</Tabs.Tab>
          <Tabs.Tab value="complete">Complete</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Card withBorder>
        <OrdersList orderState={orderState!} />
      </Card>
    </ApplicationLayout>
  );
};

export default OrdersPage;
