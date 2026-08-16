"use client";

import { useState } from "react";
import { Chat } from "@/playground/chat/Chat";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = ["overview", "support", "usage"];

  const tabLabels: Record<string, string> = {
    overview: "Overview",
    support: "Support",
    usage: "Usage",
  };

  function handleKeyDown(event: React.KeyboardEvent, currentTab: string) {
    const currentIndex = tabs.indexOf(currentTab);
    let nextTab: string | null = null;

    if (event.key === "ArrowRight") {
      nextTab = tabs[(currentIndex + 1) % tabs.length];
    }
    if (event.key === "ArrowLeft") {
      nextTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
    }
    if (nextTab) {
      setActiveTab(nextTab);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div
        className="px-6 py-10"
        style={{
          background: "linear-gradient(135deg, #2B328B 0%, #1a1f5c 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-1 text-white">Welcome back, Adaeze</h1>
          <p className="text-white/80">
            Here's what's happening with your Spectranet account.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div role="tablist" aria-label="Dashboard sections" className="flex gap-2 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(e) => handleKeyDown(e, tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <div className="text-xs text-accent font-semibold uppercase tracking-wide">
                Current Plan
              </div>
              <div className="text-xl font-bold mt-1">Spectranet Unlimited Home</div>
              <div className="text-sm text-gray-500 mt-1">Renews in 6 days</div>
            </div>
            <div className="border rounded-lg p-5 bg-white shadow-sm">
              <div className="text-xs text-accent font-semibold uppercase tracking-wide">
                Connection Status
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xl font-bold">Online</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">No issues detected</div>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Ask about your connection, plan, or account — the assistant can
              look up your current data balance for you.
            </p>
            <Chat />
          </div>
        )}

        {activeTab === "usage" && (
          <div className="border rounded-lg p-5 bg-white shadow-sm">
            <div className="text-xs text-accent font-semibold uppercase tracking-wide mb-2">
              Data Used This Cycle
            </div>
            <div className="text-2xl font-bold text-accent">42.3GB <span className="text-sm text-gray-400 font-normal">/ 100GB</span></div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-accent h-2 rounded-full" style={{ width: "42.3%" }} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}