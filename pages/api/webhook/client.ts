import prismaClient from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";
import { clerkClient } from "@clerk/nextjs/server";
import { Knock } from "@knocklabs/node";

export default RouteHandler({
  async POST(req, res) {
    const knock = new Knock(process.env.KNOCK_PRIVATE_API_KEY);
    const orderId = req.body.data.orderId;

    const order = await prismaClient.order.findFirst({
      where: {
        id: orderId,
      },
    });

    const users = await clerkClient.organizations.getOrganizationMembershipList(
      {
        organizationId: "org_2OQlg8BTIHTRWrb7HljtKydi654",
      }
    );

    const userList = await users.map((e) => e.publicUserData);
    const userIdList = await userList.map((e) => e!.userId);

    try {
      for (const user of userList) {
        await knock.users.identify(user!.userId, {
          email: user?.identifier,
          name: user?.firstName + " " + user?.lastName,
        });
      }

      await knock.notify("order-recieved", {
        recipients: userIdList,
        data: {
          actionUrl: "/orders/" + orderId,
        },
      });
    } catch (err) {
      console.log(err);
    }

    res.status(200).send(userList);
  },
});
