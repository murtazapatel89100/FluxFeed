import { Layout } from "~/components/Layout";
import { CodeBlock } from "~/components/CodeBlock";
import { Link } from "react-router";
import { binarys } from "~/lib/constants/binarys";

export function meta() {
  return [
    { title: "Getting Started - FluxFeed" },
    {
      name: "description",
      content: "Installation and setup guide for FluxFeed",
    },
  ];
}

export default function GettingStarted() {
  return (
    <Layout>
      <div className="flex text-lg font-sans flex-col gap-y-6">
        <div className="font-extrabold text-4xl">
          <h1>Getting Started</h1>
        </div>

        <p>
          Welcome to FluxFeed! This guide will help you set up and run the
          application on your system.
        </p>

        {/* Prerequisites */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Prerequisites</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Go 1.22 or higher</li>
            <li>PostgreSQL 12+</li>
            <li>Docker or Podman (for containerized setup)</li>
          </ul>
        </section>

        {/* Quick Start with Docker */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">
            Quick Start with Docker (Recommended)
          </h2>
          <p>
            The easiest way to get started is using Docker Compose to run both
            the frontend and backend:
          </p>
          <CodeBlock language="bash" title="Clone and run with Docker">
            {`git clone "https://github.com/murtazapatel89100/FluxFeed.git"
cd FluxFeed
docker compose up -d`}
          </CodeBlock>
          <p className="text-sm">
            This will start the FluxFeed server on{" "}
            <code className="bg-slate-500 px-1 rounded">
              http://localhost:8000
            </code>{" "}
            and automatically run database migrations.
          </p>
        </section>

        {/* Pre-built Binary */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">
            Quick Start with Pre-built Binary
          </h2>
          <p>
            Download a pre-built binary from the{" "}
            <Link
              to="https://github.com/murtazapatel89100/FluxFeed/releases"
              target="_blank"
              className="text-blue-600 underline hover:font-semibold"
            >
              Releases page
            </Link>
            :
          </p>
          <CodeBlock language="bash" title="Run pre-built binary">
            {`# Download for your platform (Linux, macOS, or Windows)
./fluxfeed-linux --runtime docker    # or --runtime podman`}
          </CodeBlock>

          <h3 className="text-xl font-semibold mt-2">Available Binaries</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            {binarys.map((binary) => (
              <li key={binary.name}>
                <code className="bg-slate-500 px-1 rounded">{binary.name}</code>{" "}
                - {binary.description}
              </li>
            ))}
          </ul>
        </section>

        {/* Environment Setup */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Environment Setup</h2>
          <p>
            Create a <code className="bg-slate-500 px-1 rounded">.env</code>{" "}
            file with your database credentials:
          </p>
          <CodeBlock language="bash" title="Create environment file">
            {`cp env.template .env
# Edit .env with your database credentials`}
          </CodeBlock>

          <h3 className="text-xl font-semibold mt-2">
            Required Environment Variables
          </h3>
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
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2">
                    <code>PORT</code>
                  </td>
                  <td className="px-4 py-2">Server port (default: 8000)</td>
                </tr>
                <tr className="border-b border-slate-500 ">
                  <td className="px-4 py-2">
                    <code>DATABASE_URL</code>
                  </td>
                  <td className="px-4 py-2">PostgreSQL connection string</td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2">
                    <code>API_TOKEN</code>
                  </td>
                  <td className="px-4 py-2">
                    Secure token for API authentication
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <code>DEVELOPMENT_MODE</code>
                  </td>
                  <td className="px-4 py-2">
                    Set to <code>true</code> for development (skips migrations)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold mt-4">
            Generate Secure API Token
          </h3>
          <CodeBlock language="bash" title="Generate secure token">
            {`openssl rand -hex 64`}
          </CodeBlock>
        </section>

        {/* Build from Source */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Build from Source</h2>
          <CodeBlock language="bash" title="Build and run">
            {`# Build the application
go build -o bin/fluxfeed ./cmd/server

# Run the application
./bin/fluxfeed`}
          </CodeBlock>
        </section>

        {/* Running with Local PostgreSQL */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Running with Local PostgreSQL</h2>
          <p>If you have PostgreSQL already running on your system:</p>
          <CodeBlock language="bash" title="Local setup">
            {`# Build the application
go build -o bin/fluxfeed ./cmd/server

# Create .env with your local PostgreSQL credentials
cp env.template .env

# Edit .env with your actual database details:
# DATABASE_URL=postgres://user:password@localhost:5432/your_db?sslmode=disable
# DEVELOPMENT_MODE=true

# Run the application
./bin/fluxfeed`}
          </CodeBlock>
        </section>

        {/* Docker Setup */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Docker Setup</h2>
          <CodeBlock language="bash" title="Docker Compose setup">
            {`# Copy environment template
cp env.template .env

# Using Docker Compose
docker-compose up --build

# Using Podman Compose
podman-compose up --build`}
          </CodeBlock>
          <p className="text-sm ">
            The server will start on{" "}
            <code className="bg-slate-500 px-1 rounded">
              http://localhost:8000
            </code>{" "}
            and automatically run database migrations, connect to PostgreSQL,
            and start the RSS feed scraper.
          </p>
        </section>

        {/* What's Next */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">What's Next?</h2>
          <p>Now that you have FluxFeed running, you can:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <Link
                to="/authentication"
                className="text-blue-600 underline hover:font-semibold"
              >
                Learn about Authentication
              </Link>{" "}
              - Set up API tokens and secure your requests
            </li>
            <li>
              <Link
                to="/api-reference"
                className="text-blue-600 underline hover:font-semibold"
              >
                Explore the API Reference
              </Link>{" "}
              - See all available endpoints
            </li>
            <li>
              <Link
                to="/database"
                className="text-blue-600 underline hover:font-semibold"
              >
                View the Database Schema
              </Link>{" "}
              - Understand the data structure
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
