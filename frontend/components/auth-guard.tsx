"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

interface AuthGuardProps {
  children: React.ReactNode
}

const publicRoutes = ['/login']

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      const isPublicRoute = publicRoutes.includes(pathname)
      
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/login')
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/clients')
      }
    }
  }, [isAuthenticated, loading, pathname, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4267b2] mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Don't render anything while redirecting
  const isPublicRoute = publicRoutes.includes(pathname)
  if (!isAuthenticated && !isPublicRoute) {
    return null
  }
  
  if (isAuthenticated && pathname === '/login') {
    return null
  }

  return <>{children}</>
}