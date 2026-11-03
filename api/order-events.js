import { timingSafeEqual } from "node:crypto";

export default function orderEvents(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const expectedSecret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!expectedSecret) {
    console.error("SUPABASE_WEBHOOK_SECRET is not configured.");
    return res.status(503).json({ error: "Order events are not configured." });
  }

  const suppliedSecret = req.headers["x-fast-dine-webhook-secret"];
  if (
    typeof suppliedSecret !== "string"
    || suppliedSecret.length !== expectedSecret.length
    || !timingSafeEqual(Buffer.from(suppliedSecret), Buffer.from(expectedSecret))
  ) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const event = req.body;
  if (
    !event
    || typeof event !== "object"
    || event.schema !== "public"
    || event.table !== "orders"
    || !["INSERT", "UPDATE"].includes(event.type)
    || typeof event.record?.id !== "string"
    || typeof event.record?.status !== "string"
  ) {
    return res.status(400).json({ error: "Invalid order event." });
  }

  console.info("Fast Dine order event received.", {
    type: event.type,
    orderId: event.record.id,
    status: event.record.status
  });
  return res.status(202).json({ received: true });
}
