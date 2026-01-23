import { Link, useLocation } from "react-router";
import { ChevronRight } from "lucide-react";

interface SidebarSection {
  title: string;
  links: { href: string; label: string }[];
}

const sections: SidebarSection[] = [
  {
    title: "Introduction",
    links: [
      { href: "/", label: "Overview" },
      { href: "/getting-started", label: "Getting Started" },
    ],
  },
  {
    title: "API Reference",
    links: [
      { href: "/api-reference", label: "Endpoints Overview" },
      { href: "/authentication", label: "Authentication" },
    ],
  },
  {
    title: "Database",
    links: [{ href: "/database", label: "Schema" }],
  },
  {
    title: "Advanced",
    links: [
      { href: "/configuration", label: "Configuration" },
      { href: "/architecture", label: "Architecture" },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-6 pr-4">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="mb-2 text-3xl font-semibold text-black">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-lg transition-colors ${
                      location.pathname === link.href
                        ? "bg-primary/40 text-black font-medium"
                        : "text-primary hover:text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {location.pathname === link.href && (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    <span
                      className={location.pathname === link.href ? "" : "ml-5"}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
