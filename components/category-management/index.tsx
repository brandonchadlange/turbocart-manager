import queries from "@/frontend/queries";
import { useOrganization } from "@clerk/nextjs";
import {
  Button,
  Card,
  Flex,
  Modal,
  SelectItem,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconGripVertical } from "@tabler/icons";
import axios from "axios";
import { useQuery } from "react-query";
import DragAndDropList from "../drag-and-drop-list";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@mantine/form";
import EventEmitter from "events";

const categoryEvents = new EventEmitter();

function refetchCategories() {
  categoryEvents.emit("refetch");
}

const defaultModalProps = {
  centered: true,
  withCloseButton: false,
};

class CategoryList {
  constructor(private categories: Category[]) {}

  get value() {
    return this.categories;
  }

  toSelectItemList(): SelectItem[] {
    return this.categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }
}

interface ModalState {
  opened: boolean;
  open(): void;
  close(): void;
}

async function createCategory(payload: { name: string }) {
  await axios.post("/api/category", { name: payload.name });
}

async function updateCategory(payload: { categoryId: string; name: string }) {
  await axios.put("/api/category/" + payload.categoryId, {
    name: payload.name,
  });
}

function useModalState(): ModalState {
  const [opened, setOpened] = useState(false);

  return {
    opened,
    open() {
      setOpened(true);
    },
    close() {
      setOpened(false);
    },
  };
}

function getCategoryQuery() {
  const organization = useOrganization();

  return useQuery(["categories"], queries.fetchCategories, {
    initialData: [],
    enabled: organization.isLoaded,
  });
}

const useCategoryState = () => {
  const categoryQuery = getCategoryQuery();
  const categoryList = new CategoryList(categoryQuery.data || []);

  const createCategory = async (data: { name: string }) => {
    await axios.post("/api/category", { name: data.name });
    categoryQuery.refetch();
  };

  return {
    refetch: categoryQuery.refetch,
    createCategory,
    categoryList,
  };
};

const CategoryManagementModal = ({
  state,
  category,
  mode,
}: {
  state: ModalState;
  category?: Category;
  mode: "create" | "update";
}) => {
  const [saving, setSaving] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  const onModalClose = () => {
    state.close();
    form.reset();
  };

  const onFormSubmit = async (values: any) => {
    setSaving(true);

    if (mode === "create") {
      await createCategory({ name: values.name });
    } else {
      await updateCategory({ categoryId: category!.id, name: values.name });
    }

    refetchCategories();
    setSaving(false);
    onModalClose();
  };

  useEffect(() => {
    if (category === undefined) return;
    form.setFieldValue("name", category!.name);
  }, [category]);

  return (
    <Modal
      {...defaultModalProps}
      opened={state.opened}
      onClose={() => state.close()}
      title={
        <Text size="md" weight="bold">
          {mode === "create" ? "Add" : "Manage"} category
        </Text>
      }
    >
      <form onSubmit={form.onSubmit(onFormSubmit)}>
        <Stack>
          <TextInput {...form.getInputProps("name")} label="Name" />
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
  );
};

const CategoryManagement = () => {
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const categoryState = useCategoryState();
  const categoryManagementModal = useModalState();

  const onAddCategory = () => {
    setModalMode("create");
    categoryManagementModal.open();
  };

  const onManageCategory = (category: Category) => {
    setModalMode("update");
    setSelectedCategory(category);
    categoryManagementModal.open();
  };

  const onReorder = async (categoriesSorted: Category[]) => {
    const categoryIdListRanked = categoriesSorted.map((e) => e.id);
    await axios.put("/api/category/rank", categoryIdListRanked);
    refetchCategories();
  };

  const refetchCategories = () => {
    categoryState.refetch();
  };

  useEffect(() => {
    categoryEvents.on("refetch", refetchCategories);

    () => {
      categoryEvents.off("refetch", refetchCategories);
    };
  });

  return (
    <div>
      <Flex justify="space-between" align="end" mb="md">
        <div>
          <Title size={20}>Categories</Title>
          <Text size="sm">
            Specify which categories belong to the selected menu
          </Text>
        </div>
        <Button onClick={onAddCategory} size="xs">
          Add category
        </Button>
      </Flex>
      <DragAndDropList
        onDragEnd={onReorder}
        data={categoryState.categoryList.value}
        DraggableNode={({ dragHandler, data: category }) => (
          <Card withBorder py="xs">
            <Flex justify="space-between" align="center">
              <Flex align="center" gap="xs">
                <div {...dragHandler}>
                  <IconGripVertical size="1.05rem" stroke={1.5} />
                </div>
                <Text size="sm" mt={-6}>
                  {category.name}
                </Text>
              </Flex>
              <Button
                onClick={() => onManageCategory(category)}
                size="xs"
                variant="default"
              >
                Manage
              </Button>
            </Flex>
          </Card>
        )}
      />
      <CategoryManagementModal
        mode={modalMode}
        state={categoryManagementModal}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoryManagement;
