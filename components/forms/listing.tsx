import useListingFormController, {
  ListingFormController,
} from "@/frontend/controllers/listing";
import categoryService from "@/frontend/services/category";
import menuService from "@/frontend/services/menu";
import {
  Button,
  Chip,
  Flex,
  Grid,
  Loader,
  MultiSelect,
  NumberInput,
  SelectItem,
  Space,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useQuery } from "react-query";
import Form, { FormController } from "../form";

type FormProps = {
  fc: FormController<CreateListingRequest>;
};

type ListingFormProps = {
  controller: ListingFormController;
};

const CategorySelect = ({ fc }: FormProps) => {
  const categoryListQuery = useQuery(
    "category-list",
    categoryService.fetchCategories,
    {
      initialData: [],
    }
  );

  const categoryList = categoryListQuery.data!;

  const options: SelectItem[] = categoryList.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <MultiSelect
      data={options}
      label="Select categories"
      searchable
      placeholder="Pick all that you like"
      {...fc.getInputProps("selectedCategories")}
    />
  );
};

const MenuChipList = ({ fc }: FormProps) => {
  const menuListQuery = useQuery("menu-list", menuService.fetchMenus, {
    initialData: [],
  });

  const menuList = menuListQuery.data!;

  return (
    <>
      {menuListQuery.isLoading && <Loader />}
      <Chip.Group multiple mt="sm" {...fc.getInputProps("selectedMenus")}>
        {menuList.map((menu) => (
          <Chip variant="filled" radius="sm" key={menu.id} value={menu.id}>
            {menu.name}
          </Chip>
        ))}
      </Chip.Group>
    </>
  );
};

const ListingForm = (props: ListingFormProps) => {
  const { fc, isSubmitting } = props.controller;

  return (
    <Form controller={fc}>
      <Grid columns={12}>
        <Grid.Col span={8}>
          <TextInput
            data-autofocus
            label="Name"
            required
            autoComplete="off"
            {...fc.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            {...fc.getInputProps("price")}
            icon="R"
            label="Price"
            required
            autoComplete="off"
            precision={2}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Textarea
            {...fc.getInputProps("description")}
            label="Description"
            autoComplete="off"
          />
        </Grid.Col>
      </Grid>
      <Space h={40} />
      <Text>Select menus</Text>
      <MenuChipList fc={fc} />
      <Space h={20} />
      <CategorySelect fc={fc} />
      <Space h={40} />
      <Flex justify="end" gap="sm">
        <Button variant="default" type="button">
          Cancel
        </Button>
        <Button loading={isSubmitting} type="submit">
          Submit
        </Button>
      </Flex>
    </Form>
  );
};

export default ListingForm;
