export default async function HealthPage() {
  const response = await fetch("http://localhost:3000/api/health");
  const data = await response.json();

  return (
    <main>
      <h1>Health Check</h1>
      <p>Status: {data.status}</p>
      <p>Timestamp: {data.timestamp}</p>
    </main>
  );
}