"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, FileText, Users, Car } from 'lucide-react'

export function Profile() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setName(parsedUser.name || '')
      setBio(parsedUser.bio || '')
    } else {
      router.push('/login')
    }
  }, [router])

  const handleUpdateProfile = () => {
    const updatedUser = { ...user, name, bio }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    alert('Profile updated successfully!')
  }

  if (!user) return null

  return (
    <Card className="w-[350px] bg-white bg-opacity-80 backdrop-blur-md border-pastel-blue">
      <CardHeader>
        <CardTitle className="text-pastel-blue flex items-center">
          <User className="mr-2" />
          Your Profile
        </CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="text-pastel-blue">Name</Label>
              <div className="flex items-center">
                <User className="text-pastel-blue mr-2" />
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="flex-grow border-pastel-blue" />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="bio" className="text-pastel-blue">Bio</Label>
              <div className="flex items-center">
                <FileText className="text-pastel-blue mr-2" />
                <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="flex-grow border-pastel-blue" />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="role" className="text-pastel-blue">Role</Label>
              <div className="flex items-center">
                {user.role === 'rider' ? <Users className="text-pastel-blue mr-2" /> : <Car className="text-pastel-blue mr-2" />}
                <Input id="role" value={user.role} disabled className="flex-grow border-pastel-blue bg-gray-100" />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateProfile} className="bg-pastel-blue text-white hover:bg-pastel-yellow hover:text-pastel-blue">
          Update Profile
        </Button>
      </CardFooter>
    </Card>
  )
}

