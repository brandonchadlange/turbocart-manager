import { showNotification, updateNotification } from "@mantine/notifications";

export const showCreatingNotification = () => {
  showNotification({
    id: "create-menu-item",
    title: "Creating menu item",
    message: "Please wait...",
    loading: true,
    disallowClose: true,
  });
};

export const showSuccessNotification = () => {
  updateNotification({
    id: "create-menu-item",
    color: "green",
    title: "Success!",
    message: "Menu item created...",
    disallowClose: true,
  });
};
