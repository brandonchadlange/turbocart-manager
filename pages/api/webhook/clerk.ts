import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import {
  UpdateDomainAssociationCommand,
  GetDomainAssociationCommand,
  AmplifyClient,
} from "@aws-sdk/client-amplify";

type ClerkOrgEvent =
  | "organization.created"
  | "organization.updated"
  | "organization.deleted";

export default RouteHandler({
  async POST(req, res) {
    const event = req.body.type as ClerkOrgEvent;

    switch (event) {
      case "organization.created":
        {
          const data = req.body.data as any;

          await prismaClient.merchant.create({
            data: {
              id: data.slug,
              name: data.name,
              clerkId: data.id,
            },
          });

          await registerSubdomain(data.slug);
        }
        break;
      case "organization.updated":
        {
          const data = req.body.data as any;

          await prismaClient.merchant.update({
            where: {
              id: data.slug,
            },
            data: {
              name: data.name,
            },
          });
        }
        break;
      case "organization.deleted":
        {
          const data = req.body.data as any;

          await prismaClient.merchant.deleteMany({
            where: {
              clerkId: data.id,
            },
          });
        }
        break;
    }

    res.status(200).send(true);
  },
});

function getAmplifyClient() {
  return new AmplifyClient({
    region: "eu-central-1",
    credentials: {
      accessKeyId: process.env.AMPLIFY_ACCESS_KEY as string,
      secretAccessKey: process.env.AWS_SECRET_KEY as string,
    },
  });
}

async function getExistingDomainAssociationSubdomains() {
  const client = getAmplifyClient();

  try {
    const command = new GetDomainAssociationCommand({
      appId: "d20dx504t45pvk",
      domainName: "turbocart.co.za",
    });

    const response = await client.send(command);
    return response.domainAssociation?.subDomains;
  } catch (err) {
    console.log("Failed to get domain associations");
  }
}

async function registerSubdomain(prefix: string) {
  try {
    const existing = await getExistingDomainAssociationSubdomains();
    const existingSettings = existing!.map((e) => e.subDomainSetting!);

    const client = getAmplifyClient();

    const command = new UpdateDomainAssociationCommand({
      appId: "d20dx504t45pvk",
      domainName: "turbocart.co.za",
      subDomainSettings: [
        ...existingSettings,
        {
          branchName: "main",
          prefix,
        },
      ],
    });

    await client.send(command);
  } catch (err) {
    console.log("Failed to register subdomain");
  }
}
