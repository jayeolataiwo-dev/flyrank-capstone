"use client";

import { useState } from "react";
import { mockUser } from "@/lib/mock-user";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [name, setName] = useState(mockUser.fullName);

  return (
    <main className="min-h-screen bg-white">
      <div
        className="px-6 py-10"
        style={{
          background: "linear-gradient(135deg, #2B328B 0%, #1a1f5c 100%)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold">
            {name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{name}</h1>
            <p className="text-white/80 text-sm">{mockUser.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg">Account Details</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm border rounded-lg px-4 py-2 hover:bg-gray-50"
          >
            Edit Profile
          </button>
        </div>

        <div className="border rounded-lg divide-y">
          <div className="p-4 flex justify-between">
            <span className="text-gray-500 text-sm">Full name</span>
            <span className="font-medium">{name}</span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-gray-500 text-sm">Email</span>
            <span className="font-medium">{mockUser.email}</span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-gray-500 text-sm">Phone</span>
            <span className="font-medium">{mockUser.phone}</span>
          </div>
          <div className="p-4 flex justify-between">
            <span className="text-gray-500 text-sm">Address</span>
            <span className="font-medium">{mockUser.address}</span>
          </div>
        </div>

        <h2 className="font-semibold text-lg mt-8 mb-4">Frequently Asked Questions</h2>
        <div className="border rounded-lg">
          <button
            onClick={() => setIsFaqOpen(!isFaqOpen)}
            aria-expanded={isFaqOpen}
            aria-controls="faq-content"
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="font-medium text-sm">How do I reset my password?</span>
            <span className="text-accent">{isFaqOpen ? "−" : "+"}</span>
          </button>
          {isFaqOpen && (
            <div id="faq-content" className="px-4 pb-4 text-sm text-gray-600">
              Go to Settings → Security → Change Password. You'll need your
              current password and a verification code sent to your email.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit profile"
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="font-semibold text-lg mb-4">Edit Profile</h2>
            <label htmlFor="edit-name" className="text-sm text-gray-500 block mb-1">
              Full name
            </label>
            <input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm border rounded-lg px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm bg-accent text-white rounded-lg px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}