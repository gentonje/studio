import type { ReactNode } from 'react';

// This layout can be expanded later if specific layout elements are needed for all assessment pages
// e.g., a sidebar for sections, or a consistent sub-header.
// For now, it just passes children through, inheriting from the main RootLayout.

export default function AssessmentAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}