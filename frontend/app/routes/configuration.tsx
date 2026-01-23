import { Layout } from "~/components/Layout";
import { CodeBlock } from "~/components/CodeBlock";

export function meta() {
  return [
    { title: "Configuration - FluxFeed" },
    {
      name: "description",
      content: "Configuration options and environment variables for FluxFeed",
    },
  ];
}

const envVars = [
  {
    category: "Application Settings",
    variables: [
      {
        name: "PORT",
        description: "HTTP server port",
        default: "8000",
        required: false,
      },
      {
        name: "API_TOKEN",
        description: "Secure token for API authentication",
        default: "-",
        required: true,
      },
      {
        name: "DEVELOPMENT_MODE",
        description: "Set to true to skip migrations",
        default: "false",
        required: false,
      },
    ],
  },
  {
    category: "Database Connection",
    variables: [
      {
        name: "DATABASE_URL",
        description: "PostgreSQL connection string",
        default: "-",
        required: true,
      },
    ],
  },
  {
    category: "Docker Compose Settings",
    variables: [
      {
        name: "POSTGRES_USER",
        description: "PostgreSQL username for the database container",
        default: "-",
        required: true,
      },
      {
        name: "POSTGRES_PASSWORD",
        description: "PostgreSQL password for the database container",
        default: "-",
        required: true,
      },
      {
        name: "POSTGRES_DB",
        description: "PostgreSQL database name",
        default: "-",
        required: true,
      },
      {
        name: "DB_HOST",
        description: "Database hostname (use 'db' for Docker Compose)",
        default: "db",
        required: false,
      },
      {
        name: "DB_PORT",
        description: "Database port",
        default: "5432",
        required: false,
      },
      {
        name: "DB_NAME",
        description: "Database name",
        default: "-",
        required: true,
      },
      {
        name: "DB_USER",
        description: "Database user",
        default: "-",
        required: true,
      },
      {
        name: "DB_PASSWORD",
        description: "Database password",
        default: "-",
        required: true,
      },
    ],
  },
];

const scraperConfig = {
  startDelay: "10 seconds",
  concurrency: "10 goroutines",
  interval: "60 seconds",
  behavior: "Fetches feeds ordered by last_fetched_at (null feeds first)",
};

export default function Configuration() {
  return (
    <Layout>
      <div className="flex text-lg font-sans flex-col gap-y-6">
        <div className="font-extrabold text-4xl">
          <h1>Configuration</h1>
        </div>

        <p>
          FluxFeed is configured through environment variables. This page
          documents all available configuration options.
        </p>

        {/* Environment Template */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Environment File</h2>
          <p>
            Create a <code className="bg-slate-500 px-1 rounded">.env</code>{" "}
            file from the template:
          </p>
          <CodeBlock language="bash" title="Create .env file">
            {`cp env.template .env`}
          </CodeBlock>
        </section>

        {/* Environment Variables */}
        {envVars.map((category) => (
          <section key={category.category} className="flex flex-col gap-y-3">
            <h2 className="text-2xl font-bold">{category.category}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-500 rounded-lg">
                <thead className="bg-slate-500">
                  <tr>
                    <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                      Variable
                    </th>
                    <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                      Default
                    </th>
                    <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                      Required
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {category.variables.map((variable) => (
                    <tr key={variable.name} className="border-b border-slate-500">
                      <td className="px-4 py-2 font-mono text-sm">
                        {variable.name}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {variable.description}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <code className="bg-slate-500 px-1 rounded text-xs">
                          {variable.default}
                        </code>
                      </td>
                      <td className="px-4 py-2">
                        {variable.required ? (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                            Yes
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            No
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {/* Example .env file */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Example .env File</h2>
          <CodeBlock language="env" title=".env">
            {`# Application Settings
PORT=8000
API_TOKEN=your_secure_64_char_hex_token_here
DEVELOPMENT_MODE=false

# Database Connection
DATABASE_URL=postgres://fluxfeed_user:fluxfeed_password@db:5432/fluxfeed_dev?sslmode=disable

# Docker Compose Settings (if using docker-compose)
POSTGRES_USER=fluxfeed_user
POSTGRES_PASSWORD=fluxfeed_password
POSTGRES_DB=fluxfeed_dev
DB_HOST=db
DB_PORT=5432
DB_NAME=fluxfeed_dev
DB_USER=fluxfeed_user
DB_PASSWORD=fluxfeed_password`}
          </CodeBlock>
        </section>

        {/* Background Scraper Configuration */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Background Scraper</h2>
          <p>
            The RSS scraper runs in the background with the following
            configuration:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-500 rounded-lg">
              <thead className="bg-slate-500">
                <tr>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Setting
                  </th>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-semibold">Start Delay</td>
                  <td className="px-4 py-2">{scraperConfig.startDelay}</td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-semibold">Concurrency</td>
                  <td className="px-4 py-2">{scraperConfig.concurrency}</td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-semibold">Interval</td>
                  <td className="px-4 py-2">{scraperConfig.interval}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Behavior</td>
                  <td className="px-4 py-2">{scraperConfig.behavior}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            Concurrency can be configured in{" "}
            <code className="bg-slate-500 px-1 rounded">
              cmd/server/main.go
            </code>
          </p>
        </section>

        {/* Graceful Shutdown */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Graceful Shutdown</h2>
          <p>
            FluxFeed supports graceful shutdown to ensure clean termination:
          </p>

          <h3 className="text-xl font-semibold">Signal Handling</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>SIGINT</strong> (Ctrl+C): Initiates graceful shutdown
            </li>
            <li>
              <strong>SIGTERM</strong>: Initiates graceful shutdown (useful for
              container orchestration)
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-4">Shutdown Sequence</h3>
          <div className="bg-[#205487] border border-black rounded-lg p-4">
            <ol className="list-decimal list-inside space-y-2">
              <li>Signal received → shutdown initiated</li>
              <li>Context cancellation propagates to all goroutines</li>
              <li>Background scraper stops processing new feeds</li>
              <li>HTTP server stops accepting new connections</li>
              <li>In-flight requests have 30 seconds to complete</li>
              <li>Database connection is closed</li>
              <li>Application exits cleanly</li>
            </ol>
          </div>

          <h3 className="text-xl font-semibold mt-4">Shutdown Logging</h3>
          <CodeBlock language="text" title="Example shutdown logs">
            {`Shutdown signal received, gracefully shutting down...
Scraper shutting down...
Server shutdown completed
Database connection closed
Graceful shutdown completed`}
          </CodeBlock>
        </section>

        {/* CORS Configuration */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">CORS Configuration</h2>
          <p>
            CORS is enabled by default to allow cross-origin requests from web
            applications. The configuration allows:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>All origins (configurable in production)</li>
            <li>Standard HTTP methods (GET, POST, PUT, DELETE, OPTIONS)</li>
            <li>Authorization and Content-Type headers</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}