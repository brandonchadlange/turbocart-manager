import { ModuleStateProvider } from "@/frontend/providers/module";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";

const App = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient();

  return (
    <ClerkProvider {...pageProps}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: "light",
          }}
        >
          <NotificationsProvider>
            <ModalsProvider>
              <Component {...pageProps} />
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;
