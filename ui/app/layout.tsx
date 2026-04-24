import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { LiveBackground } from "@/components/vellum/live-background"
import "./globals.css"

export const metadata: Metadata = {
  title: "Vellum — AI Design Reviewer",
  description:
    "AI design reviewer that checks its own work. Two agents debate your design against 263 rules from Apple, Google, and accessibility standards. Runs 100% on-device.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <LiveBackground />
        {children}
      </body>
    </html>
  )
}
