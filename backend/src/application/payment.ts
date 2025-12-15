import { Request, Response } from "express";
import util from "util";
import Booking from "../infrastructure/entities/Booking";
import stripe from "../infrastructure/stripe";
import Hotel from "../infrastructure/entities/Hotel";

const FRONTEND_URL = (process.env.FRONTEND_URL as string) || "http://localhost:5173";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const bookingId = req.body.bookingId as string;

    console.log("=== Creating Checkout Session ===");
    console.log("Booking ID:", bookingId);
    console.log("Frontend URL:", FRONTEND_URL);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error("Booking not found:", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking found:", {
      id: booking._id,
      hotelId: booking.hotelId,
      totalAmount: booking.totalAmount,
      checkIn: booking.checkInDate,
      checkOut: booking.checkOutDate,
    });

    const hotel = await Hotel.findById(booking.hotelId);
    if (!hotel) {
      console.error("Hotel not found:", booking.hotelId);
      return res.status(404).json({ message: "Hotel not found" });
    }

    console.log("Hotel found:", {
      id: hotel._id,
      name: hotel.name,
      price: hotel.price,
      stripePriceId: hotel.stripePriceId || "none",
    });

    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const numberOfNights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    console.log("Calculated nights:", numberOfNights);

    // Prefer stored price when available; fallback to ad-hoc price_data
    const lineItem = hotel.stripePriceId
      ? { price: hotel.stripePriceId, quantity: numberOfNights }
      : {
          price_data: {
            currency: "usd",
            product_data: {
              name: hotel.name,
              description: `${booking.roomNumber} | ${numberOfNights} night${numberOfNights > 1 ? 's' : ''}`,
              images: hotel.images && hotel.images.length > 0 ? [hotel.images[0]] : [],
            },
            unit_amount: Math.round(hotel.price * 100), // price per night in cents
          },
          quantity: numberOfNights,
        };

    console.log("Line item:", JSON.stringify(lineItem, null, 2));

    const returnUrl = `${FRONTEND_URL}/booking/complete?session_id={CHECKOUT_SESSION_ID}`;
    console.log("Return URL:", returnUrl);

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded", // CRITICAL for embedded checkout
      payment_method_types: ["card"], // Explicitly specify payment methods
      line_items: [lineItem as any],
      mode: "payment",
      return_url: returnUrl,
      metadata: {
        bookingId: booking.id.toString(),
        hotelId: hotel._id.toString(),
        guestEmail: booking.guestDetails.email,
        guestName: booking.guestDetails.name,
      },
      // Optional: pre-fill customer email
      customer_email: booking.guestDetails.email,
    });

    console.log("Stripe session created:", {
      id: session.id,
      client_secret: session.client_secret ? "✓ Present" : "✗ Missing",
      status: session.status,
      payment_status: session.payment_status,
      url: session.url,
    });

    // IMPORTANT: Return client_secret (with underscore!)
    const response = {
      clientSecret: session.client_secret,
      sessionId: session.id,
    };

    console.log("Sending response:", response);
    res.status(200).json(response);
  } catch (error: any) {
    console.error("=== Error creating checkout session ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    
    res.status(500).json({ 
      message: "Failed to create checkout session",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export const retrieveSessionStatus = async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.session_id as string;

    console.log("=== Retrieving Session Status ===");
    console.log("Session ID:", sessionId);

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Session retrieved:", {
      id: checkoutSession.id,
      status: checkoutSession.status,
      payment_status: checkoutSession.payment_status,
      customer_email: checkoutSession.customer_details?.email,
    });

    const booking = await Booking.findById(checkoutSession.metadata?.bookingId);
    if (!booking) {
      console.error("Booking not found for session:", sessionId);
      return res.status(404).json({ message: "Booking not found" });
    }

    const hotel = await Hotel.findById(booking.hotelId);
    if (!hotel) {
      console.error("Hotel not found for booking:", booking._id);
      return res.status(404).json({ message: "Hotel not found" });
    }

    // If paid, mark booking as PAID (idempotent update)
    if (checkoutSession.payment_status === "paid" && booking.paymentStatus !== "PAID") {
      console.log("Updating booking payment status to PAID");
      await Booking.findByIdAndUpdate(booking._id, { paymentStatus: "PAID" });
      booking.paymentStatus = "PAID"; // Update local object
    }

    console.log("Sending session status response");

    res.status(200).json({
      bookingId: booking._id,
      booking,
      hotel,
      status: checkoutSession.status,
      customer_email: checkoutSession.customer_details?.email,
      paymentStatus: booking.paymentStatus,
    });
  } catch (error: any) {
    console.error("=== Error retrieving session status ===");
    console.error("Error:", error);
    res.status(500).json({ 
      message: "Failed to retrieve session status",
      error: error.message,
    });
  }
};

async function fulfillCheckout(sessionId: string) {
  console.log("=== Fulfilling Checkout Session ===");
  console.log("Session ID:", sessionId);

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    
    console.log("Session details:", util.inspect(checkoutSession, false, null, true));

    const booking = await Booking.findById(checkoutSession.metadata?.bookingId);
    if (!booking) {
      console.error("Booking not found:", checkoutSession.metadata?.bookingId);
      throw new Error("Booking not found");
    }

    console.log("Current booking payment status:", booking.paymentStatus);

    if (booking.paymentStatus !== "PENDING") {
      console.log("Booking already processed, skipping");
      return; // already handled
    }

    if (checkoutSession.payment_status === "paid") {
      console.log("Updating booking to PAID");
      await Booking.findByIdAndUpdate(booking._id, { paymentStatus: "PAID" });
      console.log("Booking updated successfully");
    } else {
      console.log("Payment status is not 'paid':", checkoutSession.payment_status);
    }
  } catch (error) {
    console.error("Error in fulfillCheckout:", error);
    throw error;
  }
}

export const handleWebhook = async (req: Request, res: Response) => {
  const payload = req.body as Buffer; // raw body
  const sig = req.headers["stripe-signature"] as string;

  console.log("=== Webhook Received ===");
  console.log("Signature present:", !!sig);

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    
    console.log("Webhook event type:", event.type);
    console.log("Event ID:", event.id);

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      console.log("Processing payment event");
      await fulfillCheckout((event.data.object as any).id);
      console.log("Payment fulfilled successfully");
      res.status(200).send();
      return;
    }

    console.log("Event type not handled, acknowledging");
    res.status(200).send();
    return;
  } catch (err: any) {
    console.error("=== Webhook Error ===");
    console.error("Error message:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
};