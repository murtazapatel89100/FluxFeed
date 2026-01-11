import { Layout } from "~/components/Layout";

export function meta() {
  return [
    { title: "Database Schema - FluxFeed" },
    {
      name: "description",
      content: "Database schema documentation for FluxFeed",
    },
  ];
}

export default function Database() {
  return (
    <Layout>
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-3xl mx-auto py-12">
        <h1>Database Schema</h1>
        <p>Database schema documentation for FluxFeed</p>
      </div>
    </Layout>
  );
}
