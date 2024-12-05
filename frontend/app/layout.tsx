"use client";

import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // List of protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/ride-history'];
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      if (protectedRoutes.includes(pathname)) {
        router.push('/login');
      }
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [pathname, router]);

  // Don't show navigation on login and register pages
  const showNav = !['/login', '/register', '/'].includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {showNav && user && (
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex space-x-7">
                  <div className="flex items-center space-x-4">
                    <Link 
                      href="/dashboard"
                      className={`py-4 px-2 font-semibold hover:text-blue-500 transition duration-300 ${
                        pathname === '/dashboard' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/profile"
                      className={`py-4 px-2 font-semibold hover:text-blue-500 transition duration-300 ${
                        pathname === '/profile' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
                      }`}
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/ride-history"
                      className={`py-4 px-2 font-semibold hover:text-blue-500 transition duration-300 ${
                        pathname === '/ride-history' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
                      }`}
                    >
                      Ride History
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}