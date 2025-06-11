import { apiService } from './api'

interface LoginCredentials {
  username: string
  password: string
}

interface AuthUser {
  id: number
  username: string
  email: string
  is_active: boolean
}

class AuthService {
  private readonly TOKEN_KEY = 'tucan_manager_token'
  private readonly USER_KEY = 'tucan_manager_user'

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      // Format data as form data for OAuth2
      const formData = new FormData()
      formData.append('username', credentials.username)
      formData.append('password', credentials.password)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/login`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Login failed')
      }

      const { access_token, token_type } = await response.json()
      
      // Store token
      this.setToken(access_token)
      
      // Get user info
      const user = await this.getMe()
      this.setUser(user)
      
      return user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async getMe(): Promise<AuthUser> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get user info')
    }

    return response.json()
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    window.location.href = '/login'
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(this.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  setUser(user: AuthUser): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken()
    if (!token) return {}
    
    return {
      'Authorization': `Bearer ${token}`,
    }
  }
}

export const authService = new AuthService()
export type { AuthUser, LoginCredentials }