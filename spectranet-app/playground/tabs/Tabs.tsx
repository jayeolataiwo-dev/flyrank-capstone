

"use client";

import { useState, useRef, useEffect } from "react";

export function Tabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const tabs = ["profile", "notifications", "security"];
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function handleKeyDown(event: React.KeyboardEvent, currentTab: string) {
    const currentIndex = tabs.indexOf(currentTab);
    let nextTab: string | null = null;

    if (event.key === "ArrowRight") {
      const nextIndex = (currentIndex + 1) % tabs.length;
      nextTab = tabs[nextIndex];
    }

    if (event.key === "ArrowLeft") {
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      nextTab = tabs[prevIndex];
    }

    if (nextTab) {
      setActiveTab(nextTab);
    }
  }

  useEffect(() => {
    tabRefs.current[activeTab]?.focus();
  }, [activeTab]);

  return (
    <div>
      <div role="tablist" aria-label="Settings tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[tab] = el;
            }}
            role="tab"
            aria-selected={activeTab === tab}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={(e) => handleKeyDown(e, tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      {activeTab === "profile" && (
        <div role="tabpanel">Profile settings content goes here.</div>
      )}
      {activeTab === "notifications" && (
        <div role="tabpanel">Notifications settings content goes here.</div>
      )}
      {activeTab === "security" && (
        <div role="tabpanel">Security settings content goes here.</div>
      )}
    </div>
  );
}