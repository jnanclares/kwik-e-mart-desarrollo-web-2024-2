"use client";

import React, { useState } from "react";
import InvoiceHistory from "@/components/checkout/InvoiceHistory";
import { Navbar } from "@/components/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";

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
