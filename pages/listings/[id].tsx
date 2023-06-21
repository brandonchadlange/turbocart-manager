import DragAndDropList from "@/components/drag-and-drop-list";
import ApplicationLayout from "@/components/layouts/application";
import Money from "@/components/money";
import { makeUpdateListingCategories } from "@/frontend/mutations/category";
import { makeUpdateListingDetail } from "@/frontend/mutations/listing";
import { makeUpdateListingVariantEnabled } from "@/frontend/mutations/listing-variant";
import queries from "@/frontend/queries";
import { useOrganization } from "@clerk/nextjs";
import {
  ActionIcon,
  Badge,
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
import { useListState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { ListingVariant } from "@prisma/client";
import { IconGripVertical, IconQuestionCircle, IconTrash } from "@tabler/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
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

const Variants = ({ listing }: { listing?: ListingDetail }) => {
  const listingVariantsQuery = useQuery(
    ["listing-variants", listing],
    () => queries.fetchListingVariants(listing!.id),
    {
      enabled: listing !== undefined,
    }
  );

  const variants = listingVariantsQuery.data || [];
  const [state, handlers] = useListState(variants);
  const [modalOpened, setModalOpened] = useState(false);
  const [saving, setSaving] = useState(false);
  const [varinatId, setVariantId] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const form = useForm({
    initialValues: {
      name: "",
      additionalFee: 0,
    },
  });

  const onModalClose = () => {
    setModalOpened(false);
    form.reset();
  };

  const onVariantManage = (variant: ListingVariant) => {
    setVariantId(variant.id);
    form.setFieldValue("name", variant.name);
    form.setFieldValue(
      "additionalFee",
      variant.additionalFeeInCents === 0
        ? 0
        : variant.additionalFeeInCents / 100
    );
    setModalMode("update");
    setModalOpened(true);
  };

  const onAddVariant = () => {
    setModalMode("create");
    setModalOpened(true);
  };

  const onFormSubmit = async (values: any) => {
    setSaving(true);

    const additionalFeeInCents = values.additionalFee
      ? values.additionalFee * 100
      : 0;

    if (modalMode === "create") {
      await axios.post(`/api/listing/${listing!.id}/variant`, {
        name: values.name,
        additionalFeeInCents: additionalFeeInCents,
      });
    } else {
      await axios.put(`/api/listing-variant/${varinatId}`, {
        name: values.name,
        additionalFeeInCents: additionalFeeInCents,
      });
    }

    showNotification({
      message:
        "Variant successfully " +
        (modalMode === "create" ? "created" : "updated"),
      color: "green",
    });

    listingVariantsQuery.refetch();
    setSaving(false);
    onModalClose();
  };

  useEffect(() => {
    handlers.setState(variants);
  }, [variants]);

  const onDragEnd = async (data: ListingVariant[]) => {
    const newOrderIds = data.map((e) => e.id);

    await axios.put(
      `/api/listing/${listing!.id}/variant/position`,
      newOrderIds
    );

    listingVariantsQuery.refetch();
  };

  return (
    <div>
      <Flex justify="space-between" align="end">
        <div>
          <Title size={20}>Variants</Title>
          <Text size="sm">Alternate versions of this listing</Text>
        </div>
        <Button onClick={onAddVariant} size="xs">
          Add variant
        </Button>
      </Flex>
      <Card withBorder mt="xs" style={{ overflow: "visible" }}>
        <DragAndDropList
          data={variants}
          onDragEnd={onDragEnd}
          DraggableNode={({ dragHandler, data: variant }) => (
            <Card withBorder>
              <Flex justify="space-between" align="center">
                <Flex align="center" gap="xs">
                  <div {...dragHandler}>
                    <IconGripVertical size="1.05rem" stroke={1.5} />
                  </div>
                  <Text size="sm">{variant.name}</Text>
                  {variant.additionalFeeInCents > 0 && (
                    <Badge variant="outline" size="sm" color="gray">
                      + R{variant.additionalFeeInCents / 100}
                    </Badge>
                  )}
                </Flex>
                <Button
                  onClick={() => onVariantManage(variant)}
                  size="xs"
                  variant="default"
                >
                  Manage
                </Button>
              </Flex>
            </Card>
          )}
        />
      </Card>
      <Modal
        title={
          <Text size="md" weight="bold">
            {modalMode === "create" ? "Add" : "Manage"} variant
          </Text>
        }
        centered
        withCloseButton={false}
        opened={modalOpened}
        onClose={onModalClose}
      >
        <form onSubmit={form.onSubmit(onFormSubmit)}>
          <Stack>
            <TextInput
              {...form.getInputProps("name")}
              required
              label="Variant name"
            />
            <NumberInput
              {...form.getInputProps("additionalFee")}
              label="Additional fee"
            />
            <Flex gap="xs" justify="end">
              <Button onClick={onModalClose} variant="default">
                Cancel
              </Button>
              <Button loading={saving} type="submit">
                Save
              </Button>
            </Flex>
          </Stack>
        </form>
      </Modal>
    </div>
  );
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
          <Variants listing={listingQuery.data} />
        </Stack>
      </Container>
    </ApplicationLayout>
  );
}
