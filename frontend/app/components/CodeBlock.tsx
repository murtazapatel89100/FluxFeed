import { type ReactNode, useState } from "react";
import { Copy, Check } from "lucide-react";
import type { CodeBlockProps } from "~/types/components/types";

export function CodeBlock({
  children,
  language = "bash",
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg border border-border bg-slate-950 overflow-hidden">
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-border">
        {title && (
          <span className="text-sm font-semibold text-slate-200">{title}</span>
        )}
        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-2 text-xs text-slate-300 hover:text-slate-100 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="px-4 py-3 overflow-x-auto">
        <code className="text-sm font-mono text-slate-100">{children}</code>
      </pre>
    </div>
  );
}
