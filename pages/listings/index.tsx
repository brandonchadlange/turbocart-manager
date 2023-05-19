import TableComponent, { DataTableColumn } from "@/components/data-table/table";
import ApplicationLayout from "@/components/layouts/application";
import Money from "@/components/money";
import { makeDeleteListing } from "@/frontend/mutations/listing";
import queries from "@/frontend/queries";
import {
  ActionIcon,
  Anchor,
  Button,
  Card,
  Flex,
  Menu,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { Listing } from "@prisma/client";
import { IconDots, IconDotsVertical, IconTrash } from "@tabler/icons";
import Link from "next/link";
import { useQuery } from "react-query";

export default function MenuItems() {
  const modals = useModals();
  const productQuery = useQuery(["listing-list"], queries.fetchListings);

  const deleteListing = makeDeleteListing({
    onSuccess() {},
    onUnexpectedError(response) {},
  });

  const promptForDelete = (listing: Listing) => {
    modals.openConfirmModal({
      centered: true,
      title: "Are you sure?",
      children: (
        <Text size="sm">
          This will delete this listing and all associated data.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm() {
        deleteListing(listing.id);
      },
    });
  };

  const columns: DataTableColumn<Listing>[] = [
    {
      heading: "Name",
      component: (row) => (
        <Anchor href={`/listings/${row.id}`} component={Link}>
          {row.name}
        </Anchor>
      ),
    },
    {
      heading: "Published",
      component: (row) => (row.published ? "true" : "false"),
    },
    {
      heading: "Price",
      component: (row) => <Money currency="ZAR">{row.priceInCents}</Money>,
    },
    {
      heading: "",
      width: "20px",
      component: (row) => (
        <Menu shadow="md" width={200} position="bottom-start">
          <Menu.Target>
            <ActionIcon>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => promptForDelete(row)}
              color="red"
              icon={<IconTrash size={14} />}
            >
              Delete listing
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  const products = productQuery.data || [];

  return (
    <ApplicationLayout>
      <Flex justify="space-between" align="center">
        <Title>Listings</Title>
        <Button component={Link} href="/listings/new">
          Create New
        </Button>
      </Flex>
      <Space h={20} />
      <Card withBorder>
        <TableComponent columns={columns} data={products} />
      </Card>
    </ApplicationLayout>
  );
}
