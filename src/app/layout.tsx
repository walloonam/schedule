import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Personal schedule manager for calendar planning and daily focus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
