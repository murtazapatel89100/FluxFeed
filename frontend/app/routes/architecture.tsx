import { Layout } from "~/components/Layout";
import { CodeBlock } from "~/components/CodeBlock";

export function meta() {
  return [
    { title: "Architecture - FluxFeed" },
    {
      name: "description",
      content: "Architecture overview and design patterns in FluxFeed",
    },
  ];
}

export default function Architecture() {
  return (
    <Layout>
      <div className="flex text-lg font-sans flex-col gap-y-6">
        <div className="font-extrabold text-4xl">
          <h1>Architecture</h1>
        </div>

        <p>
          FluxFeed is built with a clean, modular architecture that separates
          concerns and promotes maintainability. This page provides an overview
          of the system design and key components.
        </p>

        {/* Project Structure */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Project Structure</h2>
          <CodeBlock language="text" title="Directory layout">
            {`.
├── cmd/                          # Command-line applications
│   ├── dev/                      # Development server
│   └── server/                   # Production server
├── internal/
│   ├── auth/                     # Authentication utilities
│   ├── database/                 # Generated sqlc code & database models
│   └── handler/                  # HTTP handlers and middleware
├── rss/
│   ├── rss.go                    # RSS feed parser
│   └── scraper.go                # Background feed scraper
├── sql/
│   ├── queries/                  # SQL query definitions
│   └── schema/                   # Database migrations
├── static/                       # Static files (HTML, images)
└── vendor/                       # Vendored dependencies`}
          </CodeBlock>
        </section>

        {/* Component Overview */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Component Overview</h2>
          <div className="bg-[#205487] border border-black rounded-lg p-4">
            <pre className="text-sm overflow-x-auto font-mono">
              {`┌─────────────────────────────────────────────────────────────┐
│                        HTTP Server                           │
│                     (Chi Router + CORS)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Middleware │  │  Handlers   │  │   Background        │  │
│  │  (Auth)     │──│  (API)      │  │   Scraper           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │              │
│         └────────────────┼────────────────────┘              │
│                          │                                   │
│                   ┌──────▼──────┐                            │
│                   │   Database  │                            │
│                   │   (sqlc)    │                            │
│                   └──────┬──────┘                            │
│                          │                                   │
│                   ┌──────▼──────┐                            │
│                   │ PostgreSQL  │                            │
│                   └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
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
                </code>
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

          <div className="bg-[#205487] border border-black rounded-lg p-4 mt-4">
            <h3 className="font-semibold mb-2">Security Note</h3>
            <p className="text-sm">
              All endpoints except{" "}
              <code className="bg-slate-500 px-1 rounded">/health</code> require
              valid API_TOKEN. Requests with missing or invalid tokens receive a
              403 Forbidden response.
            </p>
          </div>
        </section>

        {/* Feed Scraping Flow */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Feed Scraping Flow</h2>
          <div className="bg-[#205487] border border-black rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>Ticker triggers every 60 seconds</li>
              <li>
                Queries next N feeds to scrape (ordered by oldest fetch first)
              </li>
              <li>
                For each feed, spawns goroutine to:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Fetch RSS feed content</li>
                  <li>Parse XML</li>
                  <li>Extract posts</li>
                  <li>
                    Store in database (skips duplicates via unique constraint)
                  </li>
                  <li>
                    Update{" "}
                    <code className="bg-slate-500 px-1 rounded">
                      last_fetched_at
                    </code>{" "}
                    timestamp
                  </li>
                </ul>
              </li>
              <li>Respects context cancellation for graceful shutdown</li>
            </ol>
          </div>

          <div className="bg-[#205487] border border-black rounded-lg p-4 mt-4">
            <pre className="text-sm overflow-x-auto font-mono">
              {`┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│   Ticker     │────▶│   Query N     │────▶│   Spawn      │
│  (60 sec)    │     │   Feeds       │     │   Goroutines │
└──────────────┘     └───────────────┘     └──────┬───────┘
                                                   │
       ┌───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                    For Each Feed                          │
├──────────────────────────────────────────────────────────┤
│  1. Fetch RSS XML                                         │
│  2. Parse XML → Posts                                     │
│  3. Insert Posts (skip duplicates)                        │
│  4. Update last_fetched_at                                │
└──────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </section>

        {/* Post Aggregation */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Post Aggregation</h2>
          <p>
            Posts are queried via JOIN between multiple tables to create a
            personalized feed for each user:
          </p>
          <div className="bg-[#205487] border border-black rounded-lg p-4">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>posts</strong> table - the content
              </li>
              <li>
                <strong>feeds_follow</strong> table - user's subscriptions
              </li>
              <li>
                <strong>feeds</strong> table - metadata
              </li>
            </ul>
          </div>
          <p className="text-sm mt-2">
            Results are ordered by{" "}
            <code className="bg-slate-500 px-1 rounded">published_at</code>{" "}
            descending and paginated using limit/offset.
          </p>
        </section>

        {/* Key Design Decisions */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Key Design Decisions</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-slate-500 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">
                🔄 Concurrent Scraping
              </h3>
              <p className="text-sm">
                Uses goroutines for parallel feed fetching, maximizing
                throughput while respecting rate limits.
              </p>
            </div>

            <div className="border border-slate-500 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">
                📦 sqlc for Type Safety
              </h3>
              <p className="text-sm">
                SQL queries are compiled at build time, catching errors early
                and providing type-safe Go code.
              </p>
            </div>

            <div className="border border-slate-500 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🔐 API Key Auth</h3>
              <p className="text-sm">
                Simple but effective authentication using API keys, suitable for
                server-to-server communication.
              </p>
            </div>

            <div className="border border-slate-500 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">⚡ Chi Router</h3>
              <p className="text-sm">
                Lightweight, idiomatic Go router with middleware support and
                excellent performance.
              </p>
            </div>

            <div className="border border-slate-500 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">🗃️ Auto Migrations</h3>
              <p className="text-sm">
                Database schema is automatically migrated on startup, ensuring
                consistency across environments.
              </p>
            </div>

            <div className="border border-slate-500 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">
                🛑 Graceful Shutdown
              </h3>
              <p className="text-sm">
                Context propagation ensures clean termination, preventing data
                loss and connection leaks.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack Details */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Technology Stack</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-500 rounded-lg">
              <thead className="bg-slate-500">
                <tr>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Component
                  </th>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Technology
                  </th>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-semibold">Language</td>
                  <td className="px-4 py-2">Go 1.22+</td>
                  <td className="px-4 py-2 text-sm">
                    Fast, concurrent, type-safe backend
                  </td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-semibold">HTTP Router</td>
                  <td className="px-4 py-2">Chi</td>
                  <td className="px-4 py-2 text-sm">
                    Lightweight routing with middleware
                  </td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-semibold">Database</td>
                  <td className="px-4 py-2">PostgreSQL 12+</td>
                  <td className="px-4 py-2 text-sm">
                    Reliable relational data storage
                  </td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-semibold">SQL Queries</td>
                  <td className="px-4 py-2">sqlc</td>
                  <td className="px-4 py-2 text-sm">
                    Type-safe, compile-time checked queries
                  </td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-semibold">Configuration</td>
                  <td className="px-4 py-2">godotenv</td>
                  <td className="px-4 py-2 text-sm">
                    Environment variable management
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Containerization</td>
                  <td className="px-4 py-2">Docker/Podman</td>
                  <td className="px-4 py-2 text-sm">
                    Consistent deployment environments
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Middleware Chain */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Middleware Chain</h2>
          <p>
            Requests pass through a middleware chain before reaching handlers:
          </p>
          <CodeBlock language="text" title="Middleware flow">
            {`Request
   │
   ▼
┌─────────────────┐
│      CORS       │  ← Allow cross-origin requests
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Auth Check    │  ← Validate API token
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Handler      │  ← Process request
└────────┬────────┘
         │
         ▼
     Response`}
          </CodeBlock>
        </section>
      </div>
    </Layout>
  );
}
