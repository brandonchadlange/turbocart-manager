import TableComponent, { DataTableColumn } from "@/components/data-table/table";
import ApplicationLayout from "@/components/layouts/application";
import { Card } from "@mantine/core";
import axios from "axios";
import { useQuery } from "react-query";

const getProductUtilizationReport = async () => {
  const response = await axios.get("/api/reports/product-utilization");
  return response.data;
};

const ProductUtilizationReport = () => {
  const productUtilizationQuery = useQuery<any[]>(
    "product-utilization",
    getProductUtilizationReport
  );

  const columns: DataTableColumn[] = [
    {
      heading: "Menu Item",
      component: (data) => data.product.name,
    },
    {
      heading: "Amount",
      component: (data) => data.quantity,
    },
  ];

  const data = productUtilizationQuery.data || [];

  return (
    <ApplicationLayout>
      <h1>Menu item amount per day</h1>
      <Card withBorder>
        <TableComponent columns={columns} data={data} />
      </Card>
    </ApplicationLayout>
  );
};

export default ProductUtilizationReport;
