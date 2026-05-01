import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Space_Mono, Bowlby_One_SC } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://learnrep.ideabench.ai";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bowlby = Bowlby_One_SC({
  variable: "--font-bowlby",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LearnRep",
    template: "%s · LearnRep",
  },
  description: "Generate team quizzes from your agent or terminal and share a live quiz URL in seconds.",
  openGraph: {
    title: "LearnRep",
    description: "Generate team quizzes from your agent or terminal and share a live quiz URL in seconds.",
    url: "/",
    siteName: "LearnRep",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LearnRep",
    description: "Generate team quizzes from your agent or terminal and share a live quiz URL in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${bowlby.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}
