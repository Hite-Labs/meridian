"use client";

import AppSidebar from "@/components/AppSidebar";
import { useState } from "react";
import MobileHeader from "@/components/MobileHeader";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar — hidden below lg */}
      <div className="hidden lg:flex">
        <AppSidebar />
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-60 h-full">
            <AppSidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar — visible below lg */}
        <MobileHeader onMenuToggle={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto canvas-atmosphere">{children}</main>
      </div>
    </div>
  );
}
