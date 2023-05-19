import prismaClient from "@/backend/db";
import { getAuth } from "@clerk/nextjs/server";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export async function addFilterItemController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = getAuth(req);
  const merchantId = auth.orgSlug!;
  const { filterId, value } = req.body.filterId;

  let filter = await getFilterIfExists(merchantId, filterId);

  if (filter === null) {
    filter = await createFilter(merchantId, filterId);
  }

  const filterValue = await createFilterValue(filter!.id, value);

  res.status(HttpStatusCode.Created).send(filterValue);
}

function getFilterIfExists(merchantId: string, filterId: string) {
  return prismaClient.filter.findFirst({
    where: {
      merchantId,
      filterId,
    },
  });
}

function createFilter(merchantId: string, filterId: string) {
  return prismaClient.filter.findFirst({
    where: {
      merchantId,
      filterId,
    },
  });
}

function createFilterValue(filterId: string, value: string) {
  return prismaClient.filterValue.create({
    data: {
      filterId,
      value,
    },
  });
}
