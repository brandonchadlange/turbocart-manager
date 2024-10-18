import ApplicationLayout from "@/components/layouts/application";
import queries from "@/frontend/queries";
import { useOrganization } from "@clerk/nextjs";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  Menu,
  Select,
  SelectItem,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconBolt, IconFileDescription, IconTags } from "@tabler/icons";
import axios from "axios";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
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
  const modals = useModals();
  const { organization } = useOrganization();
  const [date, setDate] = useState(new Date());
  const [period, setPeriod] = useState("");
  const [search, setSearch] = useState("");

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

  const setBatchComplete = async (batch: any) => {
    await axios.put(`/api/batch/${batch.id}/fulfilled`);
    await batchQuery.refetch();

    showNotification({
      title: "Success",
      message: "Batched marked as complete!",
      color: "green",
    });
  };

  const promptForComplete = (batch: any) => {
    modals.openConfirmModal({
      centered: true,
      title: "Are you sure?",
      children: <Text size="sm">Batch will be marked as complete</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm() {
        setBatchComplete(batch);
      },
    });
  };

  const data = batchQuery.data || [];

  const listingName = (orderItem: any) => {
    if (orderItem.variant.isDefault) {
      return orderItem.variant.name;
    }

    return `${orderItem.variant.listing.name} - ${orderItem.variant.name}`;
  };

  const printLabels = () => {
    const printWindow = window.open("", "");
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
        <p ${textStyle}>${orderItem.quantity} x ${listingName(orderItem)}</p>
      `
      );

      const notes = `
        <div style="height: 10px;"></div>
        <p ${textStyle}>Note: ${batch.Order.notes}</p>
      `;

      tmpElement.innerHTML = `
        <p ${textStyle}>Order #: ${batch.orderId}</p>
        <p ${textStyle}>Student: ${batch.studentFirstName} ${
        batch.studentLastName
      }</p>
        <p ${textStyle}>Grade: ${batch.studentGrade}</p>
        <div style="height: 10px;"></div>
        <p ${textStyle}>Order:</p>
        ${orderItems.join("")}
        ${batch.Order.notes.length ? notes : ""}
      `;

      grid.appendChild(tmpElement);
    });

    printWindow?.document.body.append(grid);

    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
  };

  const printReport = () => {
    const printWindow = window.open("", "");

    printWindow!.document.body.style.fontFamily = "sans-serif";

    const heading = printWindow!.document.createElement("h3");
    heading.innerText = "Order Batch Report";
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
    periodText.innerText =
      "Period: " + menuSelectItems.find((e) => e.value === period)?.label;
    periodText.style.margin = "0px";
    periodText.style.marginBottom = "20px";

    printWindow?.document.body.append(heading, dateText, periodText);

    const table = printWindow!.document.createElement("table");
    table.style.width = "100%";
    table.setAttribute("border", "1");
    table.style.borderCollapse = "collapse";
    table.style.fontFamily = "sans-serif";
    const thead = printWindow!.document.createElement("thead");
    thead.innerHTML = `
    <tr>
      <th style="padding: 4px; text-align: left;">Student</th>
      <th style="padding: 4px; text-align: left;">Grade</th>
      <th style="padding: 4px; text-align: left;">Order #</th>
    </tr>`;

    table.append(thead);

    const tableBody = printWindow!.document.createElement("tbody");

    data.forEach((item, index) => {
      const tmpRow = printWindow!.document.createElement("tr");

      tmpRow.innerHTML = `
        <td style="padding: 4px; background-color: rgb(231, 231, 231);">${item.studentFirstName} ${item.studentLastName}</td>
        <td style="padding: 4px; background-color: rgb(231, 231, 231);">${item.studentGrade}</td>
        <td style="padding: 4px; background-color: rgb(231, 231, 231);">${item.orderId}</td>`;

      tableBody.append(tmpRow);

      item.OrderItem.forEach((orderItem: any) => {
        const tmpOrderItemRow = printWindow!.document.createElement("tr");

        tmpOrderItemRow!.innerHTML = `
        <td colspan="3">
          ${orderItem.quantity} x ${listingName(orderItem)}
        </td>`;

        tableBody.append(tmpOrderItemRow);
      });

      if (item.Order.notes.length > 0) {
        const tmpNotesRow = printWindow!.document.createElement("tr");

        tmpNotesRow!.innerHTML = `
        <td colspan="3">
          Notes: ${item.Order.notes}
        </td>`;

        tableBody.append(tmpNotesRow);
      }
    });

    table.append(tableBody);
    printWindow?.document.body.append(table);

    printWindow?.focus();
    printWindow?.print();
    printWindow?.close();
  };

  const canPrint = data.length > 0;

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
            data={menuSelectItems}
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
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Button mt="xl" variant="default" leftIcon={<IconBolt />}>
                  Actions
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconFileDescription />}
                  onClick={printReport}
                  disabled={!canPrint}
                >
                  Print Report
                </Menu.Item>
                <Menu.Item
                  icon={<IconTags />}
                  onClick={printLabels}
                  disabled={!canPrint}
                >
                  Print Labels
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
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
              <th style={{ width: "100px" }}></th>
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
                    {batch.fulfilled ? (
                      <Badge size="sm" color="green" variant="filled">
                        fulfilled
                      </Badge>
                    ) : (
                      <Badge size="sm" color="orange" variant="filled">
                        pending
                      </Badge>
                    )}
                  </td>
                  <td style={{ backgroundColor: "#e7e7e7" }}>
                    {!batch.fulfilled && (
                      <Button
                        disabled={!batch.OrderItem.every((e: any) => e.packed)}
                        size="xs"
                        variant="default"
                        onClick={() => promptForComplete(batch)}
                      >
                        Complete
                      </Button>
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}>
                    <Stack spacing={5}>
                      {batch.OrderItem.map((item: any) => (
                        <Checkbox
                          checked={item.packed}
                          onChange={(e) => {
                            if (batch.fulfilled) {
                              return;
                            }
                            setItemPacked(item);
                          }}
                          size="xs"
                          key={item.id}
                          label={
                            <Text>
                              {item.quantity} x {listingName(item)}
                            </Text>
                          }
                        />
                      ))}
                    </Stack>
                  </td>
                </tr>
                {batch.Order.notes && (
                  <tr>
                    <td colSpan={5}>
                      <Text size="xs">Notes: {batch.Order.notes}</Text>
                    </td>
                  </tr>
                )}
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
