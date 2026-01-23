import { Layout } from "~/components/Layout";
import { CodeBlock } from "~/components/CodeBlock";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "API Reference - FluxFeed" },
    { name: "description", content: "Complete API documentation for FluxFeed" },
  ];
}

const endpoints = [
  {
    category: "Health",
    items: [
      {
        method: "GET",
        path: "/v1/health",
        description: "Health check endpoint",
        auth: false,
      },
    ],
  },
  {
    category: "Users",
    items: [
      {
        method: "POST",
        path: "/v1/users/create",
        description: "Create a new user",
        auth: true,
      },
      {
        method: "GET",
        path: "/v1/users/fetch",
        description: "Get current user",
        auth: true,
      },
    ],
  },
  {
    category: "Feeds",
    items: [
      {
        method: "GET",
        path: "/v1/feeds/fetch",
        description: "Get all feeds",
        auth: true,
      },
      {
        method: "POST",
        path: "/v1/feeds/create",
        description: "Create a new feed",
        auth: true,
      },
    ],
  },
  {
    category: "Feed Follows",
    items: [
      {
        method: "POST",
        path: "/v1/feeds-follow/create",
        description: "Follow a feed",
        auth: true,
      },
      {
        method: "GET",
        path: "/v1/feeds-follow/fetch",
        description: "Get user's feed follows",
        auth: true,
      },
      {
        method: "GET",
        path: "/v1/feeds-follow/user",
        description: "Get user's feed posts",
        auth: true,
      },
      {
        method: "DELETE",
        path: "/v1/feeds-follow/delete/{feedFollowID}",
        description: "Unfollow a feed",
        auth: true,
      },
    ],
  },
];

export default function ApiReference() {
  return (
    <Layout>
      <div className="flex text-lg font-sans flex-col gap-y-6">
        <div className="font-extrabold text-4xl">
          <h1>API Reference</h1>
        </div>

        <p>
          Complete API documentation for FluxFeed. All protected endpoints
          require the{" "}
          <code className="bg-slate-500 px-1 rounded">Authorization</code>{" "}
          header. See{" "}
          <Link
            to="/authentication"
            className="text-blue-600 underline hover:font-semibold"
          >
            Authentication
          </Link>{" "}
          for details.
        </p>

        {/* Base URL */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Base URL</h2>
          <CodeBlock language="text" title="Base URL">
            {`http://localhost:8000`}
          </CodeBlock>
        </section>

        {/* Endpoints Overview */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Endpoints Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-500 rounded-lg">
              <thead className="bg-slate-500">
                <tr>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Method
                  </th>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Endpoint
                  </th>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left border-slate-500 font-semibold border-b">
                    Auth
                  </th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((category) =>
                  category.items.map((endpoint, index) => (
                    <tr
                      key={`${category.category}-${index}`}
                      className="border-b border-slate-500"
                    >
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-sm font-mono font-bold ${
                            endpoint.method === "GET"
                              ? "bg-green-100 text-green-800"
                              : endpoint.method === "POST"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-mono text-sm">
                        {endpoint.path}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {endpoint.description}
                      </td>
                      <td className="px-4 py-2">
                        {endpoint.auth ? (
                          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                            Required
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            None
                          </span>
                        )}
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Health Check */}
        <section className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Health Check</h2>
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono font-bold">
                GET
              </span>
              <code className="font-mono">/v1/health</code>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs ml-auto">
                No Auth Required
              </span>
            </div>
            <p className="text-sm mb-3">
              Check if the server is running and healthy.
            </p>
            <CodeBlock language="json" title="Response (200)">
              {`{
  "status": "ok"
}`}
            </CodeBlock>
          </div>
        </section>

        {/* User Endpoints */}
        <section className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">User Endpoints</h2>

          {/* Create User */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono font-bold">
                POST
              </span>
              <code className="font-mono">/v1/users/create</code>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs ml-auto">
                Auth Required
              </span>
            </div>
            <p className="text-sm mb-3">Create a new user account.</p>
            <CodeBlock language="json" title="Request Body">
              {`{
  "name": "John Doe"
}`}
            </CodeBlock>
            <CodeBlock language="json" title="Response (201)">
              {`{
  "id": "uuid",
  "created_at": "2025-12-15T10:00:00Z",
  "updated_at": "2025-12-15T10:00:00Z",
  "username": "John Doe",
  "api_key": "your_api_key_here"
}`}
            </CodeBlock>
          </div>

          {/* Get Current User */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono font-bold">
                GET
              </span>
              <code className="font-mono">/v1/users/fetch</code>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs ml-auto">
                Auth Required
              </span>
            </div>
            <p className="text-sm mb-3">Get the current user's information.</p>
            <CodeBlock language="json" title="Request Body">
              {`{
  "user_api_key": "your_api_key_here"
}`}
            </CodeBlock>
            <CodeBlock language="json" title="Response (200)">
              {`{
  "id": "uuid",
  "created_at": "2025-12-15T10:00:00Z",
  "updated_at": "2025-12-15T10:00:00Z",
  "username": "John Doe",
  "api_key": "your_api_key_here"
}`}
            </CodeBlock>
          </div>
        </section>

        {/* Feed Endpoints */}
        <section className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Feed Endpoints</h2>

          {/* Get All Feeds */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono font-bold">
                GET
              </span>
              <code className="font-mono">/v1/feeds/fetch</code>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs ml-auto">
                Auth Required
              </span>
            </div>
            <p className="text-sm mb-3">Retrieve all available feeds.</p>
            <CodeBlock language="json" title="Response (200)">
              {`[
  {
    "id": "uuid",
    "created_at": "2025-12-15T10:00:00Z",
    "updated_at": "2025-12-15T10:00:00Z",
    "name": "Tech News",
    "url": "https://example.com/feed.xml",
    "user_id": "uuid",
    "last_fetched_at": "2025-12-15T10:30:00Z"
  }
]`}
            </CodeBlock>
          </div>

          {/* Create Feed */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono font-bold">
                POST
              </span>
              <code className="font-mono">/v1/feeds/create</code>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs ml-auto">
                Auth Required
              </span>
            </div>
            <p className="text-sm mb-3">Create a new RSS feed subscription.</p>
            <CodeBlock language="json" title="Request Body">
              {`{
  "name": "Tech News",
  "url": "https://example.com/feed.xml"
}`}
            </CodeBlock>
            <CodeBlock language="json" title="Response (201)">
              {`{
  "id": "uuid",
  "created_at": "2025-12-15T10:00:00Z",
  "updated_at": "2025-12-15T10:00:00Z",
  "name": "Tech News",
  "url": "https://example.com/feed.xml",
  "user_id": "uuid",
  "last_fetched_at": null
}`}
            </CodeBlock>
          </div>
        </section>

        {/* Feed Follow Endpoints */}
        <section className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Feed Follow Endpoints</h2>

          {/* Follow Feed */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono font-bold">
                POST
              </span>
              <code className="font-mono">/v1/feeds-follow/create</code>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs ml-auto">
                Auth Required
              </span>
            </div>
            <p className="text-sm mb-3">Follow an existing feed.</p>
            <CodeBlock language="json" title="Request Body">
              {`{
  "feed_id": "uuid"
}`}
            </CodeBlock>
            <CodeBlock language="json" title="Response (201)">
              {`{
  "id": "uuid",
  "created_at": "2025-12-15T10:00:00Z",
  "updated_at": "2025-12-15T10:00:00Z",
  "user_id": "uuid",
  "feed_id": "uuid"
}`}
            </CodeBlock>
          </div>

          {/* Get User's Feed Follows */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono font-bold">
                GET
              </span>
              <code className="font-mono">/v1/feeds-follow/fetch</code>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs ml-auto">
                Auth Required
              </span>
            </div>
            <p className="text-sm mb-3">Get all feeds the user is following.</p>
            <CodeBlock language="json" title="Response (200)">
              {`[
  {
    "id": "uuid",
    "created_at": "2025-12-15T10:00:00Z",
    "updated_at": "2025-12-15T10:00:00Z",
    "user_id": "uuid",
    "feed_id": "uuid"
  }
]`}
            </CodeBlock>
          </div>

          {/* Get User's Feed Posts */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono font-bold">
                GET
              </span>
              <code className="font-mono">/v1/feeds-follow/user</code>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs ml-auto">
                Auth Required
              </span>
            </div>
            <p className="text-sm mb-3">
              Get posts from all feeds the user is following.
            </p>
            <CodeBlock language="json" title="Response (200)">
              {`[
  {
    "id": "uuid",
    "created_at": "2025-12-15T10:00:00Z",
    "updated_at": "2025-12-15T10:00:00Z",
    "title": "Article Title",
    "description": "Article description or content preview",
    "published_at": "2025-12-15T09:00:00Z",
    "url": "https://example.com/article",
    "feed_id": "uuid"
  }
]`}
            </CodeBlock>
          </div>

          {/* Unfollow Feed */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono font-bold">
                DELETE
              </span>
              <code className="font-mono">
                /v1/feeds-follow/delete/{"{feedFollowID}"}
              </code>
              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs ml-auto">
                Auth Required
              </span>
            </div>
            <p className="text-sm mb-3">Unfollow a feed.</p>
            <CodeBlock language="json" title="Response (200)">
              {`{
  "status": "deleted"
}`}
            </CodeBlock>
          </div>
        </section>

        {/* Error Responses */}
        <section className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Error Responses</h2>
          <p>
            All errors return JSON with an{" "}
            <code className="bg-slate-500 px-1 rounded">error</code> field:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-500 rounded-lg">
              <thead className="bg-slate-500">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold border-b border-slate-500 ">
                    Status Code
                  </th>
                  <th className="px-4 py-2 text-left font-semibold border-b border-slate-500">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="border-slate-500">
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-mono">
                      400
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Bad request (invalid JSON, missing fields)
                  </td>
                </tr>
                <tr className="border-b border-slate-500">
                  <td className="px-4 py-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono">
                      403
                    </span>
                  </td>
                  <td className="px-4 border-slate-500 py-2 text-sm">
                    Forbidden (invalid API token, authentication failed)
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">
                    <span className="bg-orange-100 border-slate-500 text-orange-800 px-2 py-1 rounded text-sm font-mono">
                      404
                    </span>
                  </td>
                  <td className="px-4 py-2 border-slate-500 text-sm">
                    Not found (endpoint doesn't exist)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">
                    <span className="bg-red-100 border-slate-500 text-red-800 px-2 py-1 rounded text-sm font-mono">
                      500
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Internal server error (database error, scraper error)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Usage Example */}
        <section className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Usage Example</h2>
          <p>Here's a complete workflow example using cURL:</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">1. Create a User</h3>
              <CodeBlock language="bash" title="Create user">
                {`curl -X POST http://localhost:8000/v1/users/create \\
  -H "Authorization: ApiKey YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe"}'`}
              </CodeBlock>
              <p className="text-sm mt-2">
                Save the returned{" "}
                <code className="bg-slate-500 px-1 rounded">api_key</code>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">2. Create a Feed</h3>
              <CodeBlock language="bash" title="Create feed">
                {`curl -X POST http://localhost:8000/v1/feeds/create \\
  -H "Authorization: ApiKey YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name":"Tech Blog",
    "url":"https://www.wagslane.dev/index.xml"
  }'`}
              </CodeBlock>
              <p className="text-sm mt-2">
                Save the returned{" "}
                <code className="bg-slate-500 px-1 rounded">feed_id</code>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">3. Follow a Feed</h3>
              <CodeBlock language="bash" title="Follow feed">
                {`curl -X POST http://localhost:8000/v1/feeds-follow/create \\
  -H "Authorization: ApiKey YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"feed_id":"FEED_ID"}'`}
              </CodeBlock>
            </div>

            <div>
              <h3 className="text-xl font-semibold">4. Retrieve Your Posts</h3>
              <p className="text-sm mb-2">
                Wait for the background scraper to run (every 60 seconds), then:
              </p>
              <CodeBlock language="bash" title="Get posts">
                {`curl -X GET http://localhost:8000/v1/feeds-follow/user \\
  -H "Authorization: ApiKey YOUR_API_TOKEN"`}
              </CodeBlock>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
