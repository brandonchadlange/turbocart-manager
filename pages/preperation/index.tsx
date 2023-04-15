import TableComponent, { DataTableColumn } from "@/components/data-table/table";
import ApplicationLayout from "@/components/layouts/application";
import { useOrganization } from "@clerk/nextjs";
import { Card, Grid, Select, SelectItem, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import { DateTime } from "luxon";
import { useState } from "react";
import { useQuery } from "react-query";

const getProductUtilizationReport = async (date: Date, period: string) => {
  const dateFormatted = DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");

  const response = await axios.get(
    `/api/reports/product-utilization?date=${dateFormatted}&period=${period}`
  );
  return response.data;
};

const ProductPreperationReport = () => {
  const { organization, isLoaded } = useOrganization();
  const [date, setDate] = useState(new Date());
  const [period, setPeriod] = useState("breakfast");

  const productUtilizationQuery = useQuery<any[]>(
    [["product-utilization", organization], date, period],
    () => getProductUtilizationReport(date, period),
    {
      enabled: isLoaded,
    }
  );

  const periods: SelectItem[] = [
    {
      value: "breakfast",
      label: "Breakfast",
    },
    {
      value: "first-break",
      label: "First Break",
    },
    {
      value: "aftercare",
      label: "Aftercare",
    },
  ];

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
      <h1>Order Preperation</h1>
      <p>Overview of meals to prepare</p>
      <Grid columns={4} mb="lg" mt="xs">
        <Grid.Col span={1}>
          <DatePicker
            value={date}
            onChange={(e) => setDate(e!)}
            placeholder="Pick date"
            label="Date"
            clearable={false}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <Select
            value={period}
            onChange={(e) => setPeriod(e!)}
            label="Period"
            data={periods}
          ></Select>
        </Grid.Col>
      </Grid>
      <Card withBorder>
        <TableComponent columns={columns} data={data} />
      </Card>
    </ApplicationLayout>
  );
};

export default ProductPreperationReport;
