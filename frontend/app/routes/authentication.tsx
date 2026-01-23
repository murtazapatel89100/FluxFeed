import { Layout } from "~/components/Layout";
import { CodeBlock } from "~/components/CodeBlock";

export function meta() {
  return [
    { title: "Authentication - FluxFeed" },
    {
      name: "description",
      content: "Authentication documentation for FluxFeed API",
    },
  ];
}

const authErrors = [
  {
    status: "403",
    message: "Authentication error: no Authorization token found",
    cause: "Missing Authorization header",
  },
  {
    status: "403",
    message: "Authentication error: invalid Token Format",
    cause: "Header format not ApiKey <token>",
  },
  {
    status: "403",
    message: "Authentication error: malformed Token Format",
    cause: "Header missing space or ApiKey prefix",
  },
  {
    status: "403",
    message: "Invalid API token",
    cause: "Token doesn't match API_TOKEN from .env",
  },
];

export default function Authentication() {
  return (
    <Layout>
      <div className="flex text-lg font-sans flex-col gap-y-6">
        <div className="font-extrabold text-4xl">
          <h1>Authentication</h1>
        </div>

        <p>
          FluxFeed uses API key-based authentication for secure access to
          protected endpoints. All endpoints except{" "}
          <code className="bg-slate-500 px-1 rounded">/v1/health</code> require
          authentication.
        </p>

        {/* Authentication Header */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Authorization Header</h2>
          <p>
            Include the API token in the{" "}
            <code className="bg-slate-500 px-1 rounded">Authorization</code>{" "}
            header with every request:
          </p>
          <CodeBlock language="http" title="Authorization Header Format">
            {`Authorization: ApiKey YOUR_API_TOKEN`}
          </CodeBlock>
        </section>

        {/* Setting Up API Token */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Setting Up Your API Token</h2>
          <p>
            The API token is configured in your{" "}
            <code className="bg-slate-500 px-1 rounded">.env</code> file:
          </p>
          <CodeBlock language="env" title=".env file">
            {`API_TOKEN=your_secure_token_here`}
          </CodeBlock>

          <h3 className="text-xl font-semibold mt-2">
            Generate a Secure Token
          </h3>
          <p>Use OpenSSL to generate a cryptographically secure token:</p>
          <CodeBlock language="bash" title="Generate secure token">
            {`openssl rand -hex 64`}
          </CodeBlock>
          <p className="text-sm">
            This generates a 128-character hexadecimal string that's suitable
            for production use.
          </p>
        </section>

        {/* Authentication Flow */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Authentication Flow</h2>
          <div className="bg-[#205487] border border-black rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>
                Application loads{" "}
                <code className="bg-slate-500 px-1 rounded">.env</code> file at
                startup via{" "}
                <code className="bg-slate-500 px-1 rounded">godotenv</code>
              </li>
              <li>
                <code className="bg-slate-500 px-1 rounded">API_TOKEN</code> is
                validated and stored in{" "}
                <code className="bg-slate-500 px-1 rounded">ApiConfig</code>
              </li>
              <li>
                Client sends request with{" "}
                <code className="bg-slate-500 px-1 rounded">
                  Authorization: ApiKey YOUR_API_TOKEN
                </code>{" "}
                header
              </li>
              <li>
                Middleware (
                <code className="bg-slate-500 px-1 rounded">
                  MiddlewareAuth
                </code>
                ) extracts token from request header
              </li>
              <li>Token is validated against the stored API_TOKEN</li>
              <li>
                If valid, request proceeds and token is stored in request
                context
              </li>
              <li>
                Handlers can access token via{" "}
                <code className="bg-slate-500 px-1 rounded">
                  GetTokenFromContext(r)
                </code>
              </li>
            </ol>
          </div>
        </section>

        {/* Example Request */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Example Authenticated Request</h2>
          <CodeBlock language="bash" title="cURL example">
            {`curl -X GET http://localhost:8000/v1/feeds/fetch \\
  -H "Authorization: ApiKey YOUR_API_TOKEN"`}
          </CodeBlock>
        </section>

        {/* Public Endpoints */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Public Endpoints</h2>
          <p>The following endpoint does not require authentication:</p>
          <div className="bg-[#205487] border border-black rounded-lg p-4">
            <h3 className="font-semibold">Health Check</h3>
            <CodeBlock language="http" title="Health endpoint">
              {`GET /v1/health

Response (200):
{
  "status": "ok"
}`}
            </CodeBlock>
          </div>
        </section>

        {/* Common Authentication Errors */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Common Authentication Errors</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-500 rounded-lg">
              <thead className="bg-slate-500">
                <tr>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Message
                  </th>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Cause
                  </th>
                </tr>
              </thead>
              <tbody>
                {authErrors.map((error, index) => (
                  <tr key={index} className="border-b border-slate-500">
                    <td className="px-4 py-2">
                      <span className="bg-red-100  text-red-800 px-2 py-1 rounded text-sm font-mono">
                        {error.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm font-mono">
                      {error.message}
                    </td>
                    <td className="px-4 py-2 text-sm">{error.cause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Security Best Practices</h2>
          <div className="bg-[#205487] border border-black rounded-lg p-4">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Never commit</strong> your{" "}
                <code className="bg-slate-500 px-1 rounded">.env</code> file to
                version control
              </li>
              <li>
                <strong>Use a unique token</strong> for each environment
                (development, staging, production)
              </li>
              <li>
                <strong>Rotate tokens periodically</strong> to minimize risk
              </li>
              <li>
                <strong>Use HTTPS</strong> in production to protect tokens in
                transit
              </li>
              <li>
                <strong>Keep tokens secret</strong> and never share them in logs
                or error messages
              </li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  );
}
