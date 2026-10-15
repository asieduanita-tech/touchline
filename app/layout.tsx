import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Touchline | Anonymised Match Scout",
  description: "An anonymised, data-led Sunday league scouting workspace."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
