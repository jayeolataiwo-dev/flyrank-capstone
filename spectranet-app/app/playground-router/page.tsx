"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy-load the 3D scene — it never ships in the initial page bundle,
// only fetched when this route is actually visited, and `ssr: false`
// since Three.js needs a real browser canvas, not server rendering.
const RouterViewer = dynamic(
  () => import("@/playground/router-viewer/RouterViewer").then((m) => m.RouterViewer),
  {
    ssr: false,
    loading: () => <ViewerFallback />,
  }
);

function ViewerFallback() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="w-full h-96 rounded-lg border bg-gray-100 animate-pulse flex items-center justify-center">
        <span className="text-gray-400 text-sm">Loading 3D viewer...</span>
      </div>
    </div>
  );
}

export default function RouterViewerPage() {
  return (
    <main className="py-16 px-6">
      <h1 className="text-xl font-bold text-center mb-2">
        Spectranet Router — 3D Preview
      </h1>
      <p className="text-gray-500 text-sm text-center mb-8">
        Drag to rotate, scroll to zoom. Try a different color or toggle the
        status LED.
      </p>
      <Suspense fallback={<ViewerFallback />}>
        <RouterViewer />
      </Suspense>
    </main>
  );
}