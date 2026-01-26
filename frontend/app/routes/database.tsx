import { Layout } from "~/components/Layout";
import { CodeBlock } from "~/components/CodeBlock";

export function meta() {
  return [
    { title: "Database Schema - FluxFeed" },
    {
      name: "description",
      content: "Database schema documentation for FluxFeed",
    },
  ];
}

const tables = [
  {
    name: "users",
    description: "Stores user accounts and authentication keys",
    columns: [
      { name: "id", type: "UUID", description: "Primary key" },
      {
        name: "created_at",
        type: "TIMESTAMP",
        description: "Record creation time",
      },
      {
        name: "updated_at",
        type: "TIMESTAMP",
        description: "Last update time",
      },
      { name: "username", type: "TEXT", description: "Unique username" },
      {
        name: "api_key",
        type: "VARCHAR(255)",
        description: "Unique API key for authentication",
      },
    ],
    sql: `CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    username TEXT NOT NULL UNIQUE,
    api_key VARCHAR(255) UNIQUE NOT NULL
);`,
  },
  {
    name: "feeds",
    description: "Stores RSS feed subscriptions",
    columns: [
      { name: "id", type: "UUID", description: "Primary key" },
      {
        name: "created_at",
        type: "TIMESTAMP",
        description: "Record creation time",
      },
      {
        name: "updated_at",
        type: "TIMESTAMP",
        description: "Last update time",
      },
      { name: "name", type: "TEXT", description: "Unique feed name" },
      { name: "url", type: "TEXT", description: "Unique RSS feed URL" },
      {
        name: "user_id",
        type: "UUID",
        description: "Foreign key to users table",
      },
      {
        name: "last_fetched_at",
        type: "TIMESTAMP",
        description: "Last scrape time (nullable)",
      },
    ],
    sql: `CREATE TABLE feeds (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_fetched_at TIMESTAMP
);`,
  },
  {
    name: "feeds_follow",
    description: "Tracks which users follow which feeds",
    columns: [
      { name: "id", type: "UUID", description: "Primary key" },
      {
        name: "created_at",
        type: "TIMESTAMP",
        description: "Record creation time",
      },
      {
        name: "updated_at",
        type: "TIMESTAMP",
        description: "Last update time",
      },
      {
        name: "user_id",
        type: "UUID",
        description: "Foreign key to users table",
      },
      {
        name: "feed_id",
        type: "UUID",
        description: "Foreign key to feeds table",
      },
    ],
    sql: `CREATE TABLE feeds_follow (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
    UNIQUE(user_id, feed_id)
);`,
  },
  {
    name: "posts",
    description: "Stores aggregated articles from RSS feeds",
    columns: [
      { name: "id", type: "UUID", description: "Primary key" },
      {
        name: "created_at",
        type: "TIMESTAMP",
        description: "Record creation time",
      },
      {
        name: "updated_at",
        type: "TIMESTAMP",
        description: "Last update time",
      },
      { name: "title", type: "TEXT", description: "Unique article title" },
      {
        name: "description",
        type: "TEXT",
        description: "Article content or preview (nullable)",
      },
      {
        name: "published_at",
        type: "TIMESTAMP",
        description: "Original publication time",
      },
      { name: "url", type: "TEXT", description: "Unique article URL" },
      {
        name: "feed_id",
        type: "UUID",
        description: "Foreign key to feeds table",
      },
    ],
    sql: `CREATE TABLE posts (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    title TEXT NOT NULL UNIQUE,
    description TEXT,
    published_at TIMESTAMP NOT NULL,
    url TEXT NOT NULL UNIQUE,
    feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE
);`,
  },
  {
    name: "schema_migrations",
    description: "Tracks applied database migrations",
    columns: [
      {
        name: "version",
        type: "INT",
        description: "Migration version (primary key)",
      },
      {
        name: "applied_at",
        type: "TIMESTAMP",
        description: "When migration was applied",
      },
    ],
    sql: `CREATE TABLE schema_migrations (
    version INT PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT NOW()
);`,
  },
];

export default function Database() {
  return (
    <Layout>
      <div className="flex text-lg font-sans flex-col gap-y-6">
        <div className="font-extrabold text-4xl">
          <h1>Database Schema</h1>
        </div>

        <p>
          FluxFeed uses PostgreSQL for data persistence. All tables are
          automatically created by the migration system when the application
          starts.
        </p>

        {/* Overview */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Schema Overview</h2>
          <p>
            The database consists of five main tables that manage users, feeds,
            subscriptions, posts, and migration tracking:
          </p>
          <div className="bg-[#205487] border border-black rounded-lg p-4">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>users</strong> - User accounts and API keys
              </li>
              <li>
                <strong>feeds</strong> - RSS feed subscriptions
              </li>
              <li>
                <strong>feeds_follow</strong> - User-feed subscription
                relationships
              </li>
              <li>
                <strong>posts</strong> - Aggregated articles from feeds
              </li>
              <li>
                <strong>schema_migrations</strong> - Migration version tracking
              </li>
            </ul>
          </div>
        </section>

        {/* Entity Relationship */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Entity Relationships</h2>
          <div className="bg-[#205487] border border-black rounded-lg p-4">
            <pre className="text-sm overflow-x-auto font-mono">
              {`┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │    feeds    │       │    posts    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──┬───│ user_id (FK)│   ┌───│ feed_id (FK)│
│ username    │   │   │ id (PK)     │◄──┘   │ id (PK)     │
│ api_key     │   │   │ name        │       │ title       │
│ created_at  │   │   │ url         │       │ description │
│ updated_at  │   │   │ last_fetched│       │ published_at│
└─────────────┘   │   └─────────────┘       │ url         │
                  │          ▲              └─────────────┘
                  │          │
                  │   ┌──────┴──────┐
                  │   │feeds_follow │
                  │   ├─────────────┤
                  └───│ user_id (FK)│
                      │ feed_id (FK)│
                      │ id (PK)     │
                      └─────────────┘`}
            </pre>
          </div>
        </section>

        {/* Tables */}
        {tables.map((table) => (
          <section key={table.name} className="flex flex-col gap-y-3">
            <h2 className="text-2xl font-bold capitalize">
              {table.name} Table
            </h2>
            <p>{table.description}</p>

            {/* Columns Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-500 rounded-lg">
                <thead className="bg-slate-500">
                  <tr>
                    <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                      Column
                    </th>
                    <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((column) => (
                    <tr key={column.name} className="border-b border-slate-500">
                      <td className="px-4 py-2 font-mono text-sm">
                        {column.name}
                      </td>
                      <td className="px-4 py-2">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-mono">
                          {column.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {column.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SQL */}
            <CodeBlock language="sql" title={`${table.name} DDL`}>
              {table.sql}
            </CodeBlock>
          </section>
        ))}

        {/* Migrations */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Database Migrations</h2>
          <p>
            Migrations are automatically applied on application startup based on
            the environment mode:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#205487] border border-black rounded-lg p-4">
              <h3 className="font-semibold mb-2">Production Mode</h3>
              <p className="text-sm">
                <code className="bg-slate-500 px-1 rounded">
                  DEVELOPMENT_MODE=false
                </code>
              </p>
              <p className="text-sm mt-2">
                Migrations run automatically when the app starts, creating all
                necessary tables.
              </p>
            </div>
            <div className="bg-[#205487] border border-black rounded-lg p-4">
              <h3 className="font-semibold mb-2">Development Mode</h3>
              <p className="text-sm">
                <code className="bg-slate-500 px-1 rounded">
                  DEVELOPMENT_MODE=true
                </code>
              </p>
              <p className="text-sm mt-2">
                Migrations are skipped. Manually run migrations using database
                management tools if needed.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-4">Check Migration Status</h3>
          <CodeBlock language="sql" title="View applied migrations">
            {`SELECT * FROM schema_migrations ORDER BY version;`}
          </CodeBlock>
        </section>

        {/* Post Aggregation */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Post Aggregation Query</h2>
          <p>
            Posts are queried via JOIN between the posts, feeds_follow, and
            feeds tables. Results are ordered by published_at descending and
            support pagination.
          </p>
          <CodeBlock language="sql" title="Example aggregation query">
            {`SELECT 
    p.id, p.title, p.description, 
    p.published_at, p.url, p.feed_id
FROM posts p
JOIN feeds f ON p.feed_id = f.id
JOIN feeds_follow ff ON f.id = ff.feed_id
WHERE ff.user_id = $1
ORDER BY p.published_at DESC
LIMIT $2 OFFSET $3;`}
          </CodeBlock>
        </section>

        {/* Configuration */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Database Configuration</h2>
          <p>Configure the database connection using environment variables:</p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-500 rounded-lg">
              <thead className="bg-slate-500">
                <tr>
                  <th className="px-4 py-2 border-slate-500 text-left font-semibold border-b">
                    Variable
                  </th>
                  <th className="px-4 py-2 border-slate-500 text-left font-semibold border-b">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-mono text-sm">DATABASE_URL</td>
                  <td className="px-4 py-2 text-sm">
                    PostgreSQL connection string (e.g.,{" "}
                    <code className="bg-slate-500 px-1 rounded text-xs">
                      postgres://user:pass@host:5432/db?sslmode=disable
                    </code>
                    )
                  </td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-mono text-sm">POSTGRES_USER</td>
                  <td className="px-4 py-2 text-sm">
                    PostgreSQL username (Docker)
                  </td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-mono text-sm">
                    POSTGRES_PASSWORD
                  </td>
                  <td className="px-4 py-2 text-sm">
                    PostgreSQL password (Docker)
                  </td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-mono text-sm">POSTGRES_DB</td>
                  <td className="px-4 py-2 text-sm">
                    PostgreSQL database name (Docker)
                  </td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2 font-mono text-sm">DB_HOST</td>
                  <td className="px-4 py-2 text-sm">Database hostname</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-mono text-sm">DB_PORT</td>
                  <td className="px-4 py-2 text-sm">
                    Database port (default: 5432)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
