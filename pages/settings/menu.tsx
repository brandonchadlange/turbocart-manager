import ApplicationLayout from "@/components/layouts/application";
import SettingsTab from "@/components/settings-tab";
import mutations from "@/frontend/mutations";
import queries from "@/frontend/queries";
import { useOrganization } from "@clerk/nextjs";
import {
  Button,
  Card,
  Container,
  Flex,
  MultiSelect,
  Select,
  SelectItem,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const { isLoaded } = useOrganization();
  const [selectedMenu, setSelectedMenu] = useState<string>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const menuQuery = useQuery("menu", queries.fetchMenus);
  const categoryQuery = useQuery(["categories"], queries.fetchCategories, {
    enabled: isLoaded,
  });
  const menuCategoryQuery = useQuery(
    ["menu-category", selectedMenu],
    () => queries.fetchMenuCategories(selectedMenu!),
    {
      enabled: selectedMenu !== undefined,
      initialData: [],
    }
  );

  const menus = menuQuery.data || [];

  const menuSelectItems: SelectItem[] = menus.map((e) => ({
    label: e.name,
    value: e.id,
  }));

  const categories = categoryQuery.data || [];

  const categorySelectItem: SelectItem[] = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const updateMenuCategories = async () => {
    setLoading(true);
    await mutations.updateMenuCategories(selectedMenu!, selectedCategories);
    setLoading(false);

    showNotification({
      message: "Successfully updated menu categories",
      color: "green",
    });

    menuCategoryQuery.refetch();
  };

  useEffect(() => {
    if (menuQuery.isLoading) {
      return;
    }

    if (menuQuery.data?.length) {
      setSelectedMenu(menuQuery.data[0].id);
    }
  }, [menuQuery.isLoading]);

  useEffect(() => {
    setSelectedCategories(menuCategoryQuery.data!.map((e) => e.id));
  }, [menuCategoryQuery.data]);

  return (
    <ApplicationLayout>
      <SettingsTab selected="menu" />
      <Space h={20} />
      <Container size="sm">
        <Title>Menu Settings</Title>
        <Select
          mt="sm"
          value={selectedMenu}
          onChange={(e) => setSelectedMenu(e!)}
          data={menuSelectItems}
        />
        <Stack mt="md">
          <div>
            <Title size={20}>Categories</Title>
            <Text size="sm">
              Specify which categories belong to the selected menu
            </Text>
            <Card withBorder style={{ overflow: "visible" }}>
              <MultiSelect
                data={categorySelectItem}
                value={selectedCategories}
                onChange={setSelectedCategories}
                label="Categories"
                searchable
              />
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
                    onClick={updateMenuCategories}
                    loading={loading}
                  >
                    Update
                  </Button>
                </Flex>
              </Card.Section>
            </Card>
          </div>
        </Stack>
      </Container>
    </ApplicationLayout>
  );
};

export default Settings;
