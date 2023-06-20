import prismaClient from "@/backend/db";
import MerchantIdUndefinedOrNullException from "@/backend/exceptions/merchantIdUndefinedOrNull";
import MerchantNotFoundException from "@/backend/exceptions/merchantNotFound";
import { RouteHandler } from "@/backend/utility/route-handler";
import { getAuth } from "@clerk/nextjs/server";
import { Merchant } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const getMerchantIdOrThrowBadRequest = (request: NextApiRequest) => {
  const { orgSlug } = getAuth(request);

  if (orgSlug === undefined || orgSlug === null) {
    throw new MerchantIdUndefinedOrNullException();
  }

  return orgSlug;
};

const getMerchantOrThrowNotFound = async (merchantId: string) => {
  const merchant = await prismaClient.merchant.findFirst({
    where: {
      id: merchantId,
    },
  });

  if (merchantId === null) {
    throw new MerchantNotFoundException();
  }

  return merchant!;
};

const sendMerchantResponse = (data: {
  response: NextApiResponse;
  merchant: Merchant;
}) => {
  const { response, merchant } = data;

  response.status(HttpStatusCode.Ok).send({
    strategy: merchant.strategy,
  });
};

export default RouteHandler({
  async GET(req, res) {
    const merchantId = getMerchantIdOrThrowBadRequest(req);
    const merchant = await getMerchantOrThrowNotFound(merchantId);

    sendMerchantResponse({
      merchant,
      response: res,
    });
  },
});
