"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SendButton } from "@/playground/button/SendButton";

const RouterViewer = dynamic(
  () => import("@/playground/router-viewer/RouterViewer").then((m) => m.RouterViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 rounded-lg border bg-gray-100 animate-pulse flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading 3D viewer...</span>
      </div>
    ),
  }
);

const plans = [
  { name: "Home Starter", price: "₦15,000/mo", data: "50GB" },
  { name: "Unlimited Home", price: "₦25,000/mo", data: "Unlimited", current: true },
  { name: "Business Pro", price: "₦45,000/mo", data: "Unlimited + Priority" },
];

export default function DataPlansPage() {
  return (
    <main className="min-h-screen bg-white">
      <div
        className="px-6 py-10"
        style={{
          background: "linear-gradient(135deg, #2B328B 0%, #1a1f5c 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">Data Plans</h1>
          <p className="text-white/80">Manage your router and explore plan options.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="font-semibold text-lg mb-4">Your Router</h2>
        <Suspense fallback={null}>
          <RouterViewer />
        </Suspense>

        <h2 className="font-semibold text-lg mt-10 mb-4">Available Plans</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-lg p-5 ${
                plan.current ? "border-accent border-2" : ""
              }`}
            >
              {plan.current && (
                <span className="text-xs text-accent font-semibold uppercase">
                  Current Plan
                </span>
              )}
              <div className="font-bold mt-1">{plan.name}</div>
              <div className="text-sm text-gray-500 mt-1">{plan.data}</div>
              <div className="text-lg font-bold mt-3">{plan.price}</div>
              {!plan.current && (
                <div className="mt-4">
                  <SendButton outcome="success" idleLabel="Upgrade" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}