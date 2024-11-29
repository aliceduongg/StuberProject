"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, FileText, Users, Car, Mail } from 'lucide-react'

export function Profile() {
  const [user, setUser] = useState<any>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch user profile from backend
    fetch('http://localhost:8080/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.msg === 'User not found') {
          router.push('/login')
        } else {
          setUser(data)
          setFirstName(data.firstName || '')
          setLastName(data.lastName || '')
          setBio(data.bio || '')
          setEmail(data.email || '')  // Set email state
        }
      })
      .catch(error => {
        console.error('Error fetching profile:', error)
        router.push('/login')
      })
  }, [router])

  const handleUpdateProfile = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('User is not logged in')
      return
    }

    // Update user profile on backend
    fetch('http://localhost:8080/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        firstName,
        lastName,
        bio
      })
    })
      .then(response => response.json())
      .then(data => {
        setUser(data)
        alert('Profile updated successfully!')
      })
      .catch(error => {
        console.error('Error updating profile:', error)
        alert('Failed to update profile')
      })
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
              <Label htmlFor="firstName" className="text-pastel-blue">First Name</Label>
              <div className="flex items-center">
                <User className="text-pastel-blue mr-2" />
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="flex-grow border-pastel-blue" />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName" className="text-pastel-blue">Last Name</Label>
              <div className="flex items-center">
                <User className="text-pastel-blue mr-2" />
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="flex-grow border-pastel-blue" />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" className="text-pastel-blue">Email</Label>
              <div className="flex items-center">
                <Mail className="text-pastel-blue mr-2" />
                <Input id="email" value={email} disabled className="flex-grow border-pastel-blue bg-gray-100" />
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



