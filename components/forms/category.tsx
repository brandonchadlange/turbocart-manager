import { CategoryFormController } from "@/frontend/controllers/category";
import { Button, Flex, Grid, Space, Textarea, TextInput } from "@mantine/core";
import Form, { FormController } from "../form";

type CategoryFormProps = {
  controller: CategoryFormController;
};

const CategoryForm = (props: CategoryFormProps) => {
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
        <Grid.Col span={12}>
          <Textarea
            {...fc.getInputProps("description")}
            label="Description"
            autoComplete="off"
          />
        </Grid.Col>
      </Grid>
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

export default CategoryForm;
