import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma"; // your prisma instance

// Define types for Clerk webhook events
interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      email_address: string;
    }>;
    first_name: string;
    // Add other properties as needed
  };
}

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error("Missing Clerk webhook secret");
  }

  const payload = await req.text();
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id")!;
  const svix_timestamp = (await headerPayload).get("svix-timestamp")!;
  const svix_signature = (await headerPayload).get("svix-signature")!;

  const wh = new Webhook(SIGNING_SECRET);

  let event: ClerkWebhookEvent;

  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as ClerkWebhookEvent;
  } catch (error) {
    console.error(error);
    return new Response("Error verifying webhook", { status: 400 });
  }

  const evtType = event.type;

  // CREATE USER
  if (evtType === "user.created") {
    const data = event.data;

    await prisma.user.create({
      data: {
        clerkId: data.id,
        email: data.email_addresses[0].email_address,
        name: data.first_name,
      }
    });
  }

  // DELETE USER
  if (evtType === "user.deleted") {
    await prisma.user.delete({
      where: { clerkId: event.data.id }
    });
  }

  return new Response("OK", { status: 200 });
}