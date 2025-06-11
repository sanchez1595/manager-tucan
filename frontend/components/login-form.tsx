"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const { login } = useAuth()
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login({
        username: formData.username,
        password: formData.password
      })
      router.push('/clients')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
    setError("")
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm
        className={className}
        onBackToLogin={handleBackToLogin}
        {...props}
      />
    )
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tus credenciales para acceder a Tucan Manager
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Usuario o Email</Label>
          <Input 
            id="username" 
            type="text" 
            placeholder="admin o admin@tucanmanager.com" 
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            required 
            disabled={isLoading}
            autoFocus
          />
        </div>
        
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="ml-auto text-sm underline-offset-4 hover:underline text-blue-600"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="Tu contraseña"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required 
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !formData.username.trim() || !formData.password.trim()}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </div>
    </form>
  )
}
