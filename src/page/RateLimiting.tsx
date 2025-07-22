export default function RateLimitPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Too Many Requests</h1>
      <p>
        You’ve made too many requests in a short time. Please wait a moment
        before trying again.
      </p>
    </div>
  );
}
