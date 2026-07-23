export default async function HealthPage() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/health`);
  const data = await response.json();

  return (
    <main>
      <h1>Health Check</h1>
      <p>Status: {data.status}</p>
      <p>Timestamp: {data.timestamp}</p>
    </main>
  );
}