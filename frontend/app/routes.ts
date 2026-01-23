import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("getting-started", "routes/getting-started.tsx"),
  route("api-reference", "routes/api-reference.tsx"),
  route("authentication", "routes/authentication.tsx"),
  route("database", "routes/database.tsx"),
  route("configuration", "routes/configuration.tsx"),
  route("architecture", "routes/architecture.tsx"),
] satisfies RouteConfig;
