import prismaClient from "@/backend/db";
import { getAuth } from "@clerk/nextjs/server";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export async function createListingController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = getAuth(req);
  const merchantId = auth.orgSlug!;

  res.status(HttpStatusCode.Created).send(null);
}

async function createListing(data: { merchantId: string }) {}
