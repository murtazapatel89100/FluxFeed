import type { ReactNode } from "react";

export interface CodeBlockProps {
  children: ReactNode;
  language?: string;
  title?: string;
}
