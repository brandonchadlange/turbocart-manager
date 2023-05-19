import TableComponent, { DataTableColumn } from "@/components/data-table/table";
import ApplicationLayout from "@/components/layouts/application";
import queries from "@/frontend/queries";
import { useOrganization } from "@clerk/nextjs";
import {
  ActionIcon,
  Card,
  Flex,
  Grid,
  Select,
  SelectItem,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconPrinter } from "@tabler/icons";
import axios from "axios";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
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
  const [period, setPeriod] = useState("");

  const menuQuery = useQuery("menu", queries.fetchMenus, {
    initialData: [],
  });

  const menuSelectItems: SelectItem[] = menuQuery.data!.map((e) => ({
    value: e.id,
    label: e.name,
  }));

  useEffect(() => {
    if (menuQuery.data && menuQuery.data.length > 0) {
      setPeriod(menuQuery.data[0].id);
    }
  }, [menuQuery.data?.length]);

  const productUtilizationQuery = useQuery<any[]>(
    [["product-utilization", organization], date, period],
    () => getProductUtilizationReport(date, period),
    {
      enabled: isLoaded,
    }
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

  const printReport = () => {
    // const printWindow = window.open("", "", "width=200,height=100");
    const printWindow = window.open("", "");
    // printWindow?.document.write("<p>Hello World!</p>");
    // printWindow?.document.close();

    printWindow!.document.body.style.fontFamily = "sans-serif";

    const heading = printWindow!.document.createElement("h1");
    heading.innerText = "Order Preperation";
    heading.style.marginBottom = "10px";

    const dateFormatted = DateTime.fromJSDate(new Date(date)).toLocaleString({
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const dateText = printWindow!.document.createElement("p");
    dateText.innerText = "Date: " + dateFormatted;
    dateText.style.margin = "0px";

    const periodText = printWindow!.document.createElement("p");
    periodText.innerText = "Period: " + period;
    periodText.style.margin = "0px";
    periodText.style.marginBottom = "20px";

    printWindow?.document.body.append(heading, dateText, periodText);

    const table = printWindow!.document.createElement("table");
    table.setAttribute("border", "1");
    table.style.borderCollapse = "collapse";
    table.style.fontFamily = "sans-serif";
    const thead = printWindow!.document.createElement("thead");
    thead.innerHTML = `
    <tr>
      <th style="padding: 4px; text-align: left;">Product</th>
      <th style="padding: 4px; text-align: left;">Quantity</th>
      <th style="padding: 4px; text-align: left;">Complete</th>
    </tr>`;

    table.append(thead);

    const tableBody = printWindow!.document.createElement("tbody");

    data.forEach((item, index) => {
      const tmpRow = printWindow!.document.createElement("tr");
      tmpRow.innerHTML = `
      <tr>
        <td style="padding: 4px;">${item.product.name}</td>
        <td style="padding: 4px;">${item.quantity}</td>
        <td style="padding: 4px;"></td>
      </tr>
      `;

      tableBody.append(tmpRow);
    });

    table.append(tableBody);
    printWindow?.document.body.append(table);

    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
  };

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
            data={menuSelectItems}
          ></Select>
        </Grid.Col>
        <Grid.Col span={1}></Grid.Col>
        <Grid.Col span={1}>
          <Flex justify="end">
            <ActionIcon variant="light" onClick={printReport} mt="xl">
              <IconPrinter />
            </ActionIcon>
          </Flex>
        </Grid.Col>
      </Grid>
      <Card withBorder>
        <TableComponent columns={columns} data={data} />
      </Card>
    </ApplicationLayout>
  );
};

export default ProductPreperationReport;
