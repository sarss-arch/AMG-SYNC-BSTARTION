import "./globals.css";
import type { Metadata } from "next";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

export const metadata: Metadata = {
  title: {
    default: "AMG SYNC",
    template: "%s · AMG SYNC"
  },
  description: "Decision Intelligence Platform for the AMG poultry ecosystem."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="app-body">
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </body>
    </html>
  );
}
