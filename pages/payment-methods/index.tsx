import { DataTableColumn } from "@/components/data-table";
import TableComponent from "@/components/data-table/table";
import ApplicationLayout from "@/components/layouts/application";
import orderService from "@/frontend/services/order";
import { Card, Space } from "@mantine/core";
import { useQuery } from "react-query";
import { useOrganization } from "@clerk/nextjs";
import { PaymentMethod } from "@prisma/client";
import axios from "axios";

const fetchPaymentMethods = async () => {
  const response = await axios.get<PaymentMethod[]>("/api/payment-method");
  return response.data;
};

const OrdersList = () => {
  const { organization, isLoaded } = useOrganization();

  const ordersQuery = useQuery(
    ["payment-methods", organization],
    fetchPaymentMethods,
    {
      enabled: isLoaded && organization !== null,
      initialData: [],
    }
  );

  const columns: DataTableColumn<PaymentMethod>[] = [
    {
      heading: "Name",
      component: (data) => data.name,
    },
    {
      heading: "Provider",
      component: (data) => data.provider,
    },
    {
      heading: "Enabled",
      component: (data) => (data.enabled ? "true" : "false"),
    },
  ];

  const tableData = ordersQuery.data || [];

  return <TableComponent columns={columns} data={tableData!} />;
};

const OrdersPage = () => {
  return (
    <ApplicationLayout>
      <h1>Payment Methods</h1>
      <Space h={20} />
      <Card withBorder>
        <OrdersList />
      </Card>
    </ApplicationLayout>
  );
};

export default OrdersPage;
