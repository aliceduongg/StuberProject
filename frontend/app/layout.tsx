import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Campus RideShare',
  description: 'Connect with fellow students for campus rides',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </NextThemesProvider>
      </body>
    </html>
  )
}
