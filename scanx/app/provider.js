"use client";
import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider } from "@clerk/nextjs";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
function Provider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <ClerkProvider>
      <div>
        <ConvexProvider client={convex}>
          <PayPalScriptProvider
            options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
          >
            {children}
          </PayPalScriptProvider>
        </ConvexProvider>
      </div>
    </ClerkProvider>
  );
}

export default Provider;
