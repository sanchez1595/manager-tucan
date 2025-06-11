"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}