import { DataTableColumn } from "@/components/data-table";
import ApplicationLayout from "@/components/layouts/application";
import { useOrganization } from "@clerk/nextjs";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  Select,
  SelectItem,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { OrderBatch } from "@prisma/client";
import { IconPrinter } from "@tabler/icons";
import axios from "axios";
import { DateTime } from "luxon";
import { useState } from "react";
import { useQuery } from "react-query";

const getBatches = async (date: Date, period: string, search: string) => {
  const dateFormatted = DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");

  const params = new URLSearchParams("");
  params.append("date", dateFormatted);
  params.append("period", period);

  if (search.trim().length > 0) {
    params.append("search", search);
  }

  const response = await axios.get<any[]>("/api/batch?" + params.toString());
  return response.data;
};

const Batches = () => {
  const { organization } = useOrganization();
  const [date, setDate] = useState(new Date());
  const [period, setPeriod] = useState("breakfast");
  const [search, setSearch] = useState("");
  const batchQuery = useQuery<any[]>(
    [["batch-list", organization], date, period, search],
    () => getBatches(date, period, search)
  );

  const setItemPacked = async (orderItem: any) => {
    await axios.put(`/api/order-item/${orderItem.id}/packed`, {
      packed: !orderItem.packed,
    });

    await batchQuery.refetch();
  };

  const columns: DataTableColumn<OrderBatch>[] = [
    {
      heading: "Date",
      component: (data) => data.dateId,
    },
    {
      heading: "Period",
      component: (data) => data.menuId,
    },
    {
      heading: "Student",
      component: (data) => `${data.studentFirstName} ${data.studentLastName}`,
    },
    {
      heading: "Grade",
      component: (data) => data.studentGrade,
    },
    {
      heading: "Status",
      component: (data) => (
        <Badge size="sm" color="orange">
          pending
        </Badge>
      ),
    },
  ];

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

  const data = batchQuery.data || [];

  const printLabels = () => {
    // const printWindow = window.open("", "", "width=200,height=100");
    const printWindow = window.open("", "");
    // printWindow?.document.write("<p>Hello World!</p>");
    // printWindow?.document.close();

    const grid = printWindow!.document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(3, 1fr)";

    data.forEach((batch, index) => {
      const tmpElement = printWindow!.document.createElement("div");
      tmpElement.style.border = "1px solid black";
      tmpElement.style.padding = "5px";

      const textStyle =
        'style="margin: 0px; font-size: 12px; font-family: sans-serif"';

      const orderItems = batch.OrderItem.map(
        (orderItem: any) => `
        <p ${textStyle}>${orderItem.quantity} x ${orderItem.product.name}</p>
      `
      );

      tmpElement.innerHTML = `
        <p ${textStyle}>Order #: ${batch.orderId}</p>
        <p ${textStyle}>Student: ${batch.studentFirstName} ${
        batch.studentLastName
      }</p>
        <p ${textStyle}>Grade: ${batch.studentGrade}</p>
        <div style="height: 10px;"></div>
        <p ${textStyle}>Order:</p>
        ${orderItems.join("")}
      `;

      grid.appendChild(tmpElement);
    });

    printWindow?.document.body.append(grid);

    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
  };

  return (
    <ApplicationLayout>
      <h1>Batches</h1>
      <Grid columns={4} mb="lg">
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
        <Grid.Col span={1}>
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            label="Search"
            placeholder="order number, student"
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <Flex justify="end">
            <ActionIcon variant="light" onClick={printLabels} mt="xl">
              <IconPrinter />
            </ActionIcon>
          </Flex>
        </Grid.Col>
      </Grid>
      <Card p={0} withBorder>
        <Table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Grade</th>
              <th>Order #</th>
              <th>Status</th>
              <th>Complete</th>
            </tr>
          </thead>
          <tbody>
            {batchQuery.data?.map((batch) => (
              <>
                <tr>
                  <td style={{ backgroundColor: "#e7e7e7" }}>
                    {batch.studentFirstName} {batch.studentLastName}
                  </td>
                  <td style={{ backgroundColor: "#e7e7e7" }}>
                    {batch.studentGrade}
                  </td>
                  <td style={{ backgroundColor: "#e7e7e7" }}>
                    {batch.Order.id}
                  </td>
                  <td style={{ backgroundColor: "#e7e7e7" }}>
                    <Badge size="sm" color="orange" variant="filled">
                      pending
                    </Badge>
                  </td>
                  <td style={{ backgroundColor: "#e7e7e7" }}>
                    <Switch />
                  </td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <Stack spacing={5}>
                      {batch.OrderItem.map((item: any) => (
                        <Checkbox
                          checked={item.packed}
                          onChange={(e) => setItemPacked(item)}
                          size="xs"
                          key={item.id}
                          label={
                            <Text>
                              {item.quantity} x {item.product.name}
                            </Text>
                          }
                        />
                      ))}
                    </Stack>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
        {/* {batchQuery.data?.map((batch) => (
          <div key={batch.id}>
            <h3>
              {batch.studentFirstName} {batch.studentLastName} -{" "}
              {batch.studentGrade} - {batch.menuId} - {batch.menuId}
            </h3>
            {batch.OrderItem.map((item: any) => (
              <div key={item.id}>
                <p>
                  {item.product.name} x {item.quantity}
                </p>
              </div>
            ))}
          </div>
        ))} */}
        {/* <TableComponent columns={columns} data={data} /> */}
      </Card>
    </ApplicationLayout>
  );
};

export default Batches;
