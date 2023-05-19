import ApplicationLayout from "@/components/layouts/application";
import { makeCreateListing } from "@/frontend/mutations/listing";
import queries from "@/frontend/queries";
import {
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Grid,
  MultiSelect,
  NumberInput,
  SelectItem,
  Space,
  Stack,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";

type CreateListingForm = {
  name: string;
  description: string;
  price: number;
};

export default function MenuItems() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createListing = makeCreateListing({
    onSuccess(listing) {
      router.push("/listings/" + listing.id);
    },
    onUnexpectedError(response) {
      showNotification({
        message: response.statusText,
        color: "red",
      });
      setLoading(false);
    },
  });

  const form = useForm<CreateListingForm>({
    initialValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const onFormSubmit = async (formData: CreateListingForm) => {
    setLoading(true);
    createListing(formData);
  };

  return (
    <ApplicationLayout>
      <Space h={20} />
      <Container size="sm">
        <Title>Create Listing</Title>
        <form onSubmit={form.onSubmit(onFormSubmit)}>
          <Stack>
            <Card withBorder style={{ overflow: "visible" }}>
              <Grid columns={2}>
                <Grid.Col span={1}>
                  <TextInput {...form.getInputProps("name")} label="Name" />
                </Grid.Col>
                <Grid.Col span={1}>
                  <NumberInput
                    label="Price"
                    {...form.getInputProps("price")}
                    precision={2}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Textarea
                    {...form.getInputProps("description")}
                    label="Description"
                  />
                </Grid.Col>
                {/* <Grid.Col span={2}>
                  <Checkbox
                    {...form.getInputProps("createMatchingProduct")}
                    label="Create matching product"
                  />
                </Grid.Col> */}
              </Grid>
            </Card>
            <Flex justify="end">
              <Button loading={loading} type="submit">
                Create
              </Button>
            </Flex>
          </Stack>
        </form>
      </Container>
    </ApplicationLayout>
  );
}
