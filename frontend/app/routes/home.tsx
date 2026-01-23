import { Layout } from "~/components/Layout";
import { CodeBlock } from "~/components/CodeBlock";
import { features } from "~/lib/constants/features";
import { techStack } from "~/lib/constants/tech-stack";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "FluxFeed - RSS Aggregator & Reader" },
    {
      name: "description",
      content: "High-performance RSS feed aggregator built with Go",
    },
  ];
}

export default function Home() {
  return (
    <Layout>
      <div className="flex text-lg font-sans flex-col gap-y-5">
        <div className="font-extrabold text-4xl">
          <h1>FluxFeed - RSS Aggregator & Reader</h1>
        </div>

        <div>
          <p>
            A high-performance, concurrent RSS feed aggregator and reader built
            with Go. FluxFeed efficiently scrapes multiple RSS feeds, stores
            articles in a PostgreSQL database, and provides a RESTful API for
            users to manage feeds and read aggregated content.
          </p>
        </div>

        <div className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Features</h2>
          <ul className="flex flex-col gap-x-2.5">
            {features.map((feature) => (
              <li key={feature.title} className="flex gap-x-2">
                <h3 className="font-semibold underline">{feature.title}:</h3>
                <p>{feature.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-y-3">
          <h2 className="text-2xl font-bold">Tech Stack</h2>
          <ul className="flex flex-col gap-x-2.5">
            {techStack.map((tech) => (
              <li key={tech.title} className="flex gap-x-2">
                <h3 className="font-semibold underline">{tech.title}:</h3>
                <p>{tech.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
