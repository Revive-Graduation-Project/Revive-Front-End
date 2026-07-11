import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from '@tanstack/react-query';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import queryClient from './lib/queryClient';

// Initialize Stripe with publishable key, guard against missing key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || null);


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>
);
