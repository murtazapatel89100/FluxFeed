import { Layout } from "~/components/Layout";

export function meta() {
  return [
    { title: "API Reference - FluxFeed" },
    { name: "description", content: "Complete API documentation for FluxFeed" },
  ];
}

export default function ApiReference() {
  return (
    <Layout>
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-3xl mx-auto py-12">
        <h1>API Reference</h1>
        <p>Complete API documentation for FluxFeed</p>
      </div>
    </Layout>
  );
}
