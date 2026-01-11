import { Layout } from "~/components/Layout";

export function meta() {
  return [
    { title: "Authentication - FluxFeed" },
    {
      name: "description",
      content: "Authentication documentation for FluxFeed API",
    },
  ];
}

export default function Authentication() {
  return (
    <Layout>
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-3xl mx-auto py-12">
        <h1>Authentication</h1>
        <p>Learn how to authenticate with the FluxFeed API</p>
      </div>
    </Layout>
  );
}
