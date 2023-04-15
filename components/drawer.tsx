import { Drawer } from "@mantine/core";
import { ReactNode, useState } from "react";

type DrawerViewModel = {
  opened: boolean;
  open: () => void;
  close: () => void;
};

type ManagementDrawerProps = {
  viewModel: DrawerViewModel;
  children: ReactNode;
};

const ManagementDrawer = (props: ManagementDrawerProps) => {
  const vm = props.viewModel;

  return (
    <Drawer
      opened={vm.opened}
      onClose={vm.close}
      title="Create menu item"
      padding="xl"
      size="xl"
      position="right"
    >
      {props.children}
    </Drawer>
  );
};

export default ManagementDrawer;

export const useDrawerViewModel = (): DrawerViewModel => {
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
};
