"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from 'lucide-react'
import { Logo } from '@/components/logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Mock login logic
    setTimeout(() => {
      if ((email === 'employee@humano.com' || email === 'hr@humano.com') && password === 'password123') {
        // In a real app, you would use Firebase Auth here
        // and store the user object/token.
        // For this scaffold, we'll just store the role in localStorage.
        const role = email === 'hr@humano.com' ? 'hr' : 'employee'
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', role === 'hr' ? 'HR Admin' : 'John Doe');
        localStorage.setItem('userEmail', email);
        router.push('/dashboard')
      } else {
        setError('Invalid email or password. Use employee@humano.com or hr@humano.com with password "password123".')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-headline">Welcome to Humano</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
           <div className="mt-4 text-center text-sm">
             <p className="text-muted-foreground">Demo Credentials:</p>
             <p className="text-xs"><b>Employee:</b> employee@humano.com</p>
             <p className="text-xs"><b>HR:</b> hr@humano.com</p>
             <p className="text-xs"><b>Password:</b> password123</p>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
