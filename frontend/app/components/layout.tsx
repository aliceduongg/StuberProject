import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Car, User } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white bg-opacity-80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-pastel-blue flex items-center">
            <Car className="mr-2" />
            Campus RideShare
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-pastel-blue hover:text-pastel-yellow hover:bg-pastel-blue">
                <Car className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-pastel-blue hover:text-pastel-yellow hover:bg-pastel-blue">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  )
}
