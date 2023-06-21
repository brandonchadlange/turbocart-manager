import CategoryManagement from "@/components/category-management";
import ApplicationLayout from "@/components/layouts/application";
import SettingsTab from "@/components/settings-tab";
import { Container, Space } from "@mantine/core";

const CategoriesPage = () => {
  return (
    <ApplicationLayout>
      <SettingsTab selected="categories" />
      <Space h={20} />
      <Container size="sm">
        <CategoryManagement />
      </Container>
    </ApplicationLayout>
  );
};

export default CategoriesPage;
