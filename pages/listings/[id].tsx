import ApplicationLayout from "@/components/layouts/application";
import Money from "@/components/money";
import { makeUpdateListingCategories } from "@/frontend/mutations/category";
import { makeUpdateListingDetail } from "@/frontend/mutations/listing";
import { makeUpdateListingVariantEnabled } from "@/frontend/mutations/listing-variant";
import queries from "@/frontend/queries";
import { useOrganization } from "@clerk/nextjs";
import {
  ActionIcon,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Modal,
  MultiSelect,
  NumberInput,
  SelectItem,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconQuestionCircle, IconTrash } from "@tabler/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

type ListingDetailForm = {
  name: string;
  description: string;
  price: number;
  published: boolean;
};

const Details = ({ listing }: { listing?: Listing }) => {
  const form = useForm<ListingDetailForm>();
  const [loading, setLoading] = useState(false);

  const updateListingDetail = makeUpdateListingDetail({
    onSuccess() {
      setLoading(false);

      showNotification({
        message: "Successfully updated listing details",
        color: "green",
      });
    },
    onUnexpectedError(response) {
      setLoading(false);

      showNotification({
        message: "Failed to update listing details",
        color: "red",
      });
    },
  });

  useEffect(() => {
    if (listing === undefined) {
      return;
    }

    form.setValues({
      name: listing.name,
      description: listing.description,
      published: listing.published,
    });

    form.setFieldValue(
      "price",
      listing.priceInCents === 0 ? 0 : listing.priceInCents / 100
    );
  }, [listing]);

  const onFormSubmit = async (data: ListingDetailForm) => {
    setLoading(true);
    updateListingDetail({
      listingId: listing!.id,
      ...data,
    });
  };

  return (
    <div>
      <Title size={20}>Details</Title>
      <Text size="sm">Manage how customers see your listing</Text>
      <form onSubmit={form.onSubmit(onFormSubmit)}>
        <Card withBorder mt="xs">
          <Grid columns={2} align="end" justify="end">
            <Grid.Col span={2}>
              <Flex justify="end">
                <Switch
                  {...form.getInputProps("published", { type: "checkbox" })}
                  label="Published"
                />
              </Flex>
            </Grid.Col>
            <Grid.Col span={1}>
              <TextInput {...form.getInputProps("name")} label="Name" />
            </Grid.Col>
            <Grid.Col span={1}>
              <NumberInput
                {...form.getInputProps("price")}
                label="Price"
                precision={2}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Textarea
                {...form.getInputProps("description")}
                label="Description"
              />
            </Grid.Col>
          </Grid>
          <Card.Section
            bg="#fafafa"
            px="md"
            py="xs"
            mt="md"
            style={{ borderTop: "1px solid #dee2e6" }}
          >
            <Flex justify="end">
              <Button
                size="xs"
                loading={loading}
                variant="default"
                type="submit"
              >
                Update
              </Button>
            </Flex>
          </Card.Section>
        </Card>
      </form>
    </div>
  );
};

const Categories = ({ listing }: { listing?: ListingDetail }) => {
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { isLoaded } = useOrganization();

  const categoryQuery = useQuery(["categories"], queries.fetchCategories, {
    enabled: isLoaded,
  });

  const updateListingCategories = makeUpdateListingCategories({
    onSuccess() {
      setLoading(false);

      showNotification({
        message: "Successfully updated product categories",
        color: "green",
      });
    },
    onUnexpectedError(response) {
      setLoading(false);

      showNotification({
        title: "An error has occured",
        message: response.statusText,
        color: "red",
      });
    },
  });

  useEffect(() => {
    if (listing === undefined) {
      return;
    }

    setSelectedCategories(listing.categories.map((e) => e.id));
  }, [listing]);

  const updateSelectedCategories = async () => {
    setLoading(true);
    updateListingCategories({
      listingId: listing!.id,
      categoryIdList: selectedCategories,
    });
  };

  const categories = categoryQuery.data || [];

  const categorySelectItem: SelectItem[] = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <div>
      <Title size={20}>Categories</Title>
      <Text size="sm">How customers find your listing</Text>
      <Card withBorder mt="xs" style={{ overflow: "visible" }}>
        <Grid columns={1}>
          <Grid.Col span={1}>
            <MultiSelect
              label="Categories"
              value={selectedCategories}
              onChange={setSelectedCategories}
              data={categorySelectItem}
              searchable
            />
          </Grid.Col>
        </Grid>
        <Card.Section
          bg="#fafafa"
          px="md"
          py="xs"
          mt="md"
          style={{ borderTop: "1px solid #dee2e6" }}
        >
          <Flex justify="end">
            <Button
              size="xs"
              variant="default"
              onClick={updateSelectedCategories}
              loading={loading}
            >
              Update
            </Button>
          </Flex>
        </Card.Section>
      </Card>
    </div>
  );
};

type VariantForm = {
  name: string;
  options: { name: string; additionalAmount: number }[];
};

export default function MenuItems() {
  const { query } = useRouter();
  const listingId = query.id as string;

  const listingQuery = useQuery(
    ["listing", listingId],
    () => queries.fetchListing(listingId),
    {
      enabled: listingId !== undefined,
    }
  );

  return (
    <ApplicationLayout>
      <Container size="sm">
        <Stack spacing="xl">
          <Details listing={listingQuery.data} />
          <Categories listing={listingQuery.data} />
        </Stack>
      </Container>
    </ApplicationLayout>
  );
}
