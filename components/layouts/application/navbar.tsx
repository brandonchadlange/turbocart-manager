import { useModuleState } from "@/frontend/providers/module";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import {
  Anchor,
  Button,
  Group,
  List,
  Navbar,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBox,
  IconChecklist,
  IconCreditCard,
  IconMenuOrder,
  IconPackages,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons";
import Link from "next/link";
import { ReactNode } from "react";

interface NavbarLinkProps {
  icon: ReactNode;
  color: string;
  label: string;
  href: string;
}

function NavbarLink({ icon, color, label, href }: NavbarLinkProps) {
  return (
    <UnstyledButton
      component={Link}
      href={href}
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const ApplicationNavbar = () => {
  return (
    <Navbar width={{ base: 300 }} p="xs">
      <Navbar.Section grow mt="md">
        <NavbarLink
          label="Orders"
          href="/orders"
          icon={<IconShoppingCart size="1rem" />}
          color="violet"
        />
        <NavbarLink
          label="Batches"
          href="/batches"
          icon={<IconMenuOrder size="1rem" />}
          color="violet"
        />
        <NavbarLink
          label="Preperation"
          href="/preperation"
          icon={<IconChecklist size="1rem" />}
          color="violet"
        />
        <NavbarLink
          label="Listings"
          href="/listings"
          icon={<IconPackages size="1rem" />}
          color="violet"
        />
        {/* <NavbarLink
          label="Products"
          href="/products"
          icon={<IconBox size="1rem" />}
          color="violet"
        /> */}
        <NavbarLink
          label="Payment Methods"
          href="/payment-methods"
          icon={<IconCreditCard size="1rem" />}
          color="violet"
        />
        <NavbarLink
          label="Settings"
          href="/settings"
          icon={<IconSettings size="1rem" />}
          color="violet"
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default ApplicationNavbar;
