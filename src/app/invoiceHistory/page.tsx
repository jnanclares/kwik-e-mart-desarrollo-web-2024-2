"use client";

import React, { useState } from "react";
import InvoiceHistory from "@/components/Checkout/InvoiceHistory";
import { Navbar } from "@/components/Navbar";
import { AuthModal } from "@/components/Auth/AuthModal";

export default function InvoiceHistoryPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  return (
    <div>
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
      <InvoiceHistory />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
