import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Car, ArrowLeft } from 'lucide-react'


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-100 text-blue-900">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/" className="text-2xl font-extrabold flex items-center hover:text-blue-200 transition duration-300">
            <ArrowLeft className="mr-2 h-8 w-8" />
          </Link>


          <nav className="flex items-center space-x-4 ml-auto">
            <Link href="/dashboard"
               className="text-lg font-medium px-4 py-2 text-white hover:text-blue-200 hover:scale-105 transition-transform duration-300 flex items-center">
                Dashboard
            </Link>


            <Link href="/profile" className="text-lg font-medium px-4 py-2 text-white hover:text-blue-200 hover:scale-105 transition-transform duration-300 flex items-center">
                Profile
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 relative">{children}</main>


      {/* Footer */}
      <footer className="bg-blue-800 text-blue-200 text-center py-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Stuber. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

