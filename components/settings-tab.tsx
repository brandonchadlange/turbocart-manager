import { Tabs } from "@mantine/core";
import { IconCategory, IconPlugConnected } from "@tabler/icons";
import { useRouter } from "next/router";

const SettingsTab = ({ selected }: { selected: string }) => {
  const router = useRouter();

  const onTabChange = (value: string) => {
    if (value === "general") {
      router.push("/settings");
      return;
    }

    router.push("/settings/" + value);
  };

  return (
    <Tabs radius="xs" defaultValue={selected} onTabChange={onTabChange}>
      <Tabs.List>
        <Tabs.Tab value="general" icon={<IconCategory size="0.8rem" />}>
          General
        </Tabs.Tab>
        <Tabs.Tab value="menu" icon={<IconCategory size="0.8rem" />}>
          Menus
        </Tabs.Tab>
        <Tabs.Tab value="modules" icon={<IconPlugConnected size="0.8rem" />}>
          Modules
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

export default SettingsTab;
