import { Layout } from "~/components/Layout";

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
      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-3xl mx-auto py-12">
        <h1>Getting Started</h1>
        <p>Welcome to FluxFeed! Follow the steps below to get started.</p>
      </div>
    </Layout>
  );
}
