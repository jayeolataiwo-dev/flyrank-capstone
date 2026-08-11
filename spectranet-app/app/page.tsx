import { ShaderHero } from "@/components/shader-hero/ShaderHero";

export default function Home() {
  return (
    <main className="relative min-h-[calc(100vh-57px)] flex items-center justify-center overflow-hidden">
      <ShaderHero />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Spectranet, Reimagined
        </h1>
        <p className="mt-4 text-lg text-white/90 drop-shadow">
          A faster, clearer self-care experience — built as a redesign
          concept for the Spectranet internet service.
        </p>
        
          <a href="/dashboard"
          className="inline-block mt-8 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          View the Dashboard
        </a>
      </div>
    </main>
  );
}