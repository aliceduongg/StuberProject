import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Car, User } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-light text-blue-dark">
      <header className="border-b bg-pastel-blue bg-opacity-80 backdrop-blur-md z-10">
        <div className="flex items-center justify-between py-4 px-4 w-full">
          <Link href="/" className="text-2xl font-bold text-white flex items-center">
            <Car className="mr-2" />
            Campus RideShare
          </Link>
          <nav className="flex items-center space-x-4 ml-auto">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white text-lg px-2 py-3 hover:text-pastel-yellow hover:bg-blue-dark flex items-center">
                <Car className="mr-2 h-6 w-6"  />
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-white text-lg px-2 py-3 hover:text-pastel-yellow hover:bg-blue-dark flex items-center">
                <User className="mr-2 h-6 w-6"  />
                Profile
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 relative">{children}</main>
    </div>
  )
}
