import { getHealthStatus } from "@/lib/health";

export const dynamic = "force-dynamic";

export default function HealthPage() {
  const data = getHealthStatus();

  return (
    <main>
      <h1>Health Check</h1>
      <p>Status: {data.status}</p>
      <p>Timestamp: {data.timestamp}</p>
    </main>
  );
}