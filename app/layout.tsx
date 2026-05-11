import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Assistant Network",
  description: "Shared knowledge layer for the AI Assistant Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} bg-gray-950 text-gray-100 min-h-full`}>
        {children}
      </body>
    </html>
  );
}
