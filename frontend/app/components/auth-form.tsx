"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type AuthFormProps = {
    type: 'login' | 'signup'
  }

export function AuthForm({ type }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('rider')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically call your authentication API
        console.log('Submitting', { email, password, role })
        // Simulate successful authentication
        localStorage.setItem('user', JSON.stringify({ email, role }))
        router.push('/dashboard')
      }

      return (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{type === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription>Enter your details to {type === 'login' ? 'login' : 'create an account'}.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {type === 'signup' && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      title="Role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="rider">Rider</option>
                      <option value="driver">Driver</option>
                    </select>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push(type === 'login' ? '/signup' : '/login')}>
              {type === 'login' ? 'Sign Up' : 'Login'}
            </Button>
            <Button type="submit" onClick={handleSubmit}>{type === 'login' ? 'Login' : 'Sign Up'}</Button>
          </CardFooter>
        </Card>
      )
}