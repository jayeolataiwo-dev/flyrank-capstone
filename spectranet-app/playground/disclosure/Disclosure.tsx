"use client";

import { useState } from "react";

export function Disclosure() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
        <button onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}
  aria-controls="disclosure-content">
Show details
        </button>
        {isOpen && (
  <div id="disclosure-content">
    Here are the details that were hidden.
  </div>
)}
    </div>
  );
}