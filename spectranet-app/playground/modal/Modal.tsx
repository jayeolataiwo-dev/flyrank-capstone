
"use client";

import { useState, useRef, useEffect } from "react";

export function Modal() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    openButtonRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const elements = Array.from(focusableElements) as HTMLElement[];
      const currentIndex = elements.indexOf(document.activeElement as HTMLElement);

      event.preventDefault();

      let nextIndex;
      if (event.shiftKey) {
        nextIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
      } else {
        nextIndex = currentIndex === elements.length - 1 || currentIndex === -1
          ? 0
          : currentIndex + 1;
      }

      elements[nextIndex].focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div>
      <button ref={openButtonRef} onClick={openModal}>
        Open Modal
      </button>

      {isOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Example dialog"
          tabIndex={-1}
        >
          <p>This is the modal content.</p>
          <button ref={closeButtonRef} onClick={closeModal}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}