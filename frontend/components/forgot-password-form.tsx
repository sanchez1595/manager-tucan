"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface ForgotPasswordFormProps extends React.ComponentProps<"form"> {
  onBackToLogin: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  className,
  onBackToLogin,
  ...props
}) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsEmailSent(true)
    } catch (err) {
      setError("Error al enviar el email. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setEmail("")
    setIsEmailSent(false)
    setError("")
    onBackToLogin()
  }

  if (isEmailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Email enviado</h1>
            <p className="text-muted-foreground text-sm text-balance mt-2">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          <p className="text-sm text-gray-600 text-center">
            Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleBackToLogin}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form 
      className={cn("flex flex-col gap-6", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">¿Olvidaste tu contraseña?</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tu email y te enviaremos un enlace para recuperar tu cuenta
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="forgot-email">Email</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder="tu-email@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoFocus
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
          disabled={isLoading || !email.trim()}
        >
          {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          onClick={handleBackToLogin}
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al login
        </Button>
      </div>
    </form>
  )
}