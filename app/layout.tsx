import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import ViewportSetter from "@/components/viewport-setter"

export const metadata: Metadata = {
  title: "Mystic Realm - Game Login",
  description: "Enter the adventure in Mystic Realm",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <ViewportSetter />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html {
              font-family: ${GeistSans.style.fontFamily};
              --font-sans: ${GeistSans.variable};
              --font-mono: ${GeistMono.variable};
            }
          `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
