import { getProviders } from "next-auth/react";

export async function GET() {
  const providers = await getProviders();
  return Response.json(providers);
}
