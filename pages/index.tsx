import ApplicationLayout from "@/components/layouts/application";
import { CreateOrganization, useOrganization } from "@clerk/nextjs";
import { Anchor, Title } from "@mantine/core";
import { useEffect, useState } from "react";

type PageState = "ORG_LOADING" | "NORMAL";

export default function Home() {
  const [pageState, setPageState] = useState<PageState>("ORG_LOADING");
  const organiszation = useOrganization();

  useEffect(() => {
    if (organiszation.isLoaded) {
      setPageState("NORMAL");
    }
  }, [organiszation.isLoaded]);

  if (pageState === "ORG_LOADING") {
    return (
      <ApplicationLayout>
        <p>Loading...</p>
      </ApplicationLayout>
    );
  }

  return (
    <ApplicationLayout>
      {/* <SignIn /> */}
      {!organiszation.organization && <CreateOrganization />}
      {organiszation.organization && (
        <>
          <Title>{organiszation.organization.name}</Title>
          <Anchor
            target="_blank"
            href={`https://${organiszation.organization.slug}.turbocart.co.za`}
          >{`${organiszation.organization.slug}.turbocart.co.za`}</Anchor>
        </>
      )}
      <br />
    </ApplicationLayout>
  );
}
