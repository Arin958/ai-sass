import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string;
    last_name: string;
    username: string;

  };
}

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
  const payload = await req.text();

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id")!;
  const svix_timestamp = headerPayload.get("svix-timestamp")!;
  const svix_signature = headerPayload.get("svix-signature")!;

  const wh = new Webhook(SIGNING_SECRET);

  let event: ClerkWebhookEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (error) {
    console.error("Webhook verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const data = event.data;

  try {
      if (event.type === "user.created") {
   await prisma.user.upsert({
  where: { clerkId: data.id },
  update: {}, // no-op if exists
  create: {
    clerkId: data.id,
    email: data.email_addresses[0].email_address,
    // Use the actual field names from your Prisma schema
    firstName: data.first_name,    // if your model has firstName
    lastName: data.last_name,      // if your model has lastName
    username: data.username,
  },
});
  }
  } catch (error) {
    console.error("Error upserting user", error);
  }



  if (event.type === "user.deleted") {
    await prisma.user.deleteMany({
      where: { clerkId: data.id },
    });
  }

  return new Response("OK", { status: 200 });
}
