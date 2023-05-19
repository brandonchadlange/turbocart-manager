import ApplicationLayout from "@/components/layouts/application";
import SettingsTab from "@/components/settings-tab";
import { Card, Center, Grid, Stack, UnstyledButton } from "@mantine/core";

const Settings = () => {
  return (
    <ApplicationLayout>
      <SettingsTab selected="modules" />
      <h1>Modules</h1>
    </ApplicationLayout>
  );
};

export default Settings;
