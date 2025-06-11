"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ArrowLeft, 
  Save,
  Palette,
  FolderOpen,
  Calendar,
  Users,
  Building2,
  Edit,
  MoreHorizontal,
  Grid3X3,
  List,
  Plus,
  ExternalLink,
  UserPlus,
  Trash,
  Shield,
  Mail,
  Phone
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// Mock data enriquecido
const mockClientData = {
  1: {
    id: 1,
    name: "Empresa ABC Corp",
    owner_contact: "María García",
    owner_email: "maria.garcia@abc-corp.com",
    owner_phone: "+1 555-0123",
    status: "active",
    created_at: "2024-01-15",
    last_activity: "2024-06-09",
    projects: [
      {
        id: 1,
        name: "Portal Corporativo",
        description: "Plataforma web principal para gestión empresarial",
        status: "active",
        progress: 85,
        start_date: "2024-01-15",
        end_date: "2024-12-31",
        team_size: 8,
        budget: 125000,
        priority: "high",
        services: {
          mdm: { active: true, name: "MDM", usage: 78 },
          dynamic_forms: { active: true, name: "Formularios", usage: 92 },
          reporting: { active: true, name: "Reportería", usage: 65 },
          elearning: { active: false, name: "E-Learning", usage: 0 },
          omnichannel: { active: false, name: "Omnichannel", usage: 0 },
          communication_campaigns: { active: false, name: "Campañas", usage: 0 }
        }
      },
      {
        id: 2,
        name: "App Móvil Empleados",
        description: "Aplicación móvil para gestión de recursos humanos",
        status: "active",
        progress: 62,
        start_date: "2024-02-01",
        end_date: "2024-11-30",
        team_size: 5,
        budget: 85000,
        priority: "medium",
        services: {
          mdm: { active: true, name: "MDM", usage: 88 },
          dynamic_forms: { active: false, name: "Formularios", usage: 0 },
          reporting: { active: false, name: "Reportería", usage: 0 },
          elearning: { active: true, name: "E-Learning", usage: 45 },
          omnichannel: { active: false, name: "Omnichannel", usage: 0 },
          communication_campaigns: { active: false, name: "Campañas", usage: 0 }
        }
      }
    ],
    users: [
      {
        id: 1,
        name: "María García",
        email: "maria.garcia@abc-corp.com",
        role: "admin",
        status: "active",
        last_login: "2024-06-09",
        created_at: "2024-01-15"
      },
      {
        id: 2,
        name: "Carlos Mendoza",
        email: "carlos.mendoza@abc-corp.com",
        role: "editor",
        status: "active",
        last_login: "2024-06-08",
        created_at: "2024-02-01"
      },
      {
        id: 3,
        name: "Ana Rodríguez",
        email: "ana.rodriguez@abc-corp.com",
        role: "viewer",
        status: "inactive",
        last_login: "2024-05-15",
        created_at: "2024-03-01"
      }
    ],
    ui_config: {
      primary_color: "#4267b2",
      secondary_color: "#64748b",
      accent_color: "#4267b2",
      logo_url: "",
      favicon_url: "",
      company_name: "ABC Corp",
      theme: "light",
      language: "es",
      timezone: "Europe/Madrid",
      custom_css: "",
      custom_domain: "",
      login_background: "",
      footer_text: "© 2024 ABC Corp. Todos los derechos reservados.",
      support_email: "soporte@tucanmanager.com",
      enable_notifications: true,
      enable_dark_mode: true,
      sidebar_style: "default",
      header_style: "default",
      login_logo_url: "",
      welcome_message: "Bienvenido a tu plataforma corporativa",
      brand_colors: {
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#4267b2"
      },
      fonts: {
        primary: "Inter",
        secondary: "system-ui"
      },
      layout_settings: {
        sidebar_width: "280px",
        header_height: "64px",
        border_radius: "8px"
      }
    }
  }
}

const availableServices = {
  mdm: { name: "MDM", description: "Mobile Device Management" },
  dynamic_forms: { name: "Formularios", description: "Formularios dinámicos" },
  reporting: { name: "Reportería", description: "Sistema de reportes" },
  elearning: { name: "E-Learning", description: "Plataforma educativa" },
  omnichannel: { name: "Omnichannel", description: "Comunicación multicanal" },
  communication_campaigns: { name: "Campañas", description: "Campañas de comunicación" }
}

const ClientDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const clientId = parseInt(params.id as string)
  
  const clientData = mockClientData[clientId as keyof typeof mockClientData]
  const [projects, setProjects] = useState(clientData?.projects || [])
  const [users, setUsers] = useState(clientData?.users || [])
  const [uiConfig, setUiConfig] = useState(clientData?.ui_config || {
    primary_color: "#4267b2",
    secondary_color: "#64748b",
    accent_color: "#4267b2", 
    logo_url: "",
    favicon_url: "",
    company_name: "",
    theme: "light",
    language: "es",
    timezone: "Europe/Madrid",
    custom_css: "",
    custom_domain: "",
    login_background: "",
    footer_text: "",
    support_email: "",
    enable_notifications: true,
    enable_dark_mode: true,
    sidebar_style: "default",
    header_style: "default",
    login_logo_url: "",
    welcome_message: "",
    brand_colors: {
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#4267b2"
    },
    fonts: {
      primary: "Inter",
      secondary: "system-ui"
    },
    layout_settings: {
      sidebar_width: "280px",
      header_height: "64px",
      border_radius: "8px"
    }
  })
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
    priority: "medium",
    services: [] as string[]
  })
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer"
  })
  
  if (!clientData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-medium text-gray-900 mb-2">Cliente no encontrado</h1>
          <Button variant="outline" onClick={() => router.push("/clients")}>
            Volver a clientes
          </Button>
        </div>
      </div>
    )
  }

  const handleServiceToggle = (projectId: number, serviceKey: string, value: boolean) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? {
              ...project,
              services: {
                ...project.services,
                [serviceKey]: {
                  ...project.services[serviceKey as keyof typeof project.services],
                  active: value
                }
              }
            }
          : project
      )
    )
    setHasUnsavedChanges(true)
  }

  const handleUiConfigChange = (field: string, value: string) => {
    setUiConfig(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    setHasUnsavedChanges(false)
    // TODO: Implementar guardado real
  }

  const handleCreateProject = () => {
    const project = {
      id: Date.now(),
      ...newProject,
      status: "development",
      progress: 0,
      team_size: 3,
      budget: parseInt(newProject.budget) || 0,
      services: Object.keys(availableServices).reduce((acc, key) => ({
        ...acc,
        [key]: { 
          active: newProject.services.includes(key), 
          name: availableServices[key as keyof typeof availableServices].name, 
          usage: 0 
        }
      }), {})
    }
    setProjects(prev => [...prev, project])
    setNewProject({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      budget: "",
      priority: "medium",
      services: []
    })
    setIsCreateProjectOpen(false)
    setHasUnsavedChanges(true)
  }

  const handleCreateUser = () => {
    const user = {
      id: Date.now(),
      ...newUser,
      status: "active",
      last_login: null,
      created_at: new Date().toISOString().split('T')[0]
    }
    setUsers(prev => [...prev, user])
    setNewUser({
      name: "",
      email: "",
      role: "viewer"
    })
    setIsCreateUserOpen(false)
    setHasUnsavedChanges(true)
  }

  const handleImpersonate = () => {
    // TODO: Implementar lógica de suplantación
    window.open(`/client-portal/${clientId}`, '_blank')
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      development: "bg-amber-50 text-amber-700 border-amber-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
      inactive: "bg-gray-50 text-gray-600 border-gray-200"
    }
    const labels = {
      active: "Activo", development: "Desarrollo", completed: "Completado", inactive: "Inactivo"
    }
    return (
      <Badge className={`${variants[status as keyof typeof variants]} font-medium`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-50 text-red-700 border-red-200",
      medium: "bg-yellow-50 text-yellow-700 border-yellow-200", 
      low: "bg-green-50 text-green-600 border-green-200"
    }
    const labels = { high: "Alta", medium: "Media", low: "Baja" }
    return (
      <Badge variant="outline" className={`${variants[priority as keyof typeof variants]} text-xs`}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-purple-50 text-purple-700 border-purple-200",
      editor: "bg-blue-50 text-blue-700 border-blue-200",
      viewer: "bg-gray-50 text-gray-600 border-gray-200"
    }
    const labels = { admin: "Administrador", editor: "Editor", viewer: "Visor" }
    return (
      <Badge className={`${variants[role as keyof typeof variants]} font-medium text-xs`}>
        {labels[role as keyof typeof labels]}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency', currency: 'EUR', minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header simplificado */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/clients")}
                className="text-gray-600 hover:text-gray-900 self-start"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Clientes
              </Button>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-50 rounded-xl">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">{clientData.name}</h1>
                  <p className="text-sm text-gray-500">Cliente desde {formatDate(clientData.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button 
                onClick={handleImpersonate}
                variant="outline" 
                className="border-green-300 text-green-700 hover:bg-green-50 h-10 text-sm"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Ingresar como Cliente</span>
                <span className="sm:hidden">Ingresar</span>
              </Button>
              {hasUnsavedChanges && (
                <Button onClick={handleSave} className="bg-[#4267b2] hover:bg-[#345995] text-white shadow-sm h-10 text-sm">
                  <Save className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Guardar Cambios</span>
                  <span className="sm:hidden">Guardar</span>
                </Button>
              )}
              <Button variant="outline" className="border-gray-300 h-10 text-sm">
                <Edit className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Editar Cliente</span>
                <span className="sm:hidden">Editar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de pestañas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Tabs defaultValue="projects" className="w-full">
          <div className="border-b border-gray-100 px-3 sm:px-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 bg-transparent p-1 sm:p-0 gap-1 sm:gap-0">
              <TabsTrigger value="projects" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-0 text-xs sm:text-sm">
                <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Proyectos</span>
                <span className="sm:hidden">Proy.</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-0 text-xs sm:text-sm">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Servicios</span>
                <span className="sm:hidden">Serv.</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-0 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Usuarios</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="ui-config" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-0 text-xs sm:text-sm">
                <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Configuración UI</span>
                <span className="sm:hidden">UI</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Pestaña de Proyectos */}
          <TabsContent value="projects" className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Proyectos</h2>
                <p className="text-sm text-gray-500">Gestiona los proyectos del cliente</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className={`h-8 px-3 ${viewMode === "cards" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className={`h-8 px-3 ${viewMode === "table" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#4267b2] hover:bg-[#345995] text-white h-10 text-sm">
                      <Plus className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Nuevo Proyecto</span>
                      <span className="sm:hidden">Nuevo</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="project_name">Nombre del proyecto</Label>
                        <Input
                          id="project_name"
                          value={newProject.name}
                          onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Portal Corporativo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="project_description">Descripción</Label>
                        <Input
                          id="project_description"
                          value={newProject.description}
                          onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Descripción del proyecto"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start_date">Fecha inicio</Label>
                          <Input
                            id="start_date"
                            type="date"
                            value={newProject.start_date}
                            onChange={(e) => setNewProject(prev => ({ ...prev, start_date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="end_date">Fecha fin</Label>
                          <Input
                            id="end_date"
                            type="date"
                            value={newProject.end_date}
                            onChange={(e) => setNewProject(prev => ({ ...prev, end_date: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="budget">Presupuesto (€)</Label>
                          <Input
                            id="budget"
                            type="number"
                            value={newProject.budget}
                            onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                            placeholder="125000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="priority">Prioridad</Label>
                          <Select value={newProject.priority} onValueChange={(value) => setNewProject(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Baja</SelectItem>
                              <SelectItem value="medium">Media</SelectItem>
                              <SelectItem value="high">Alta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">Servicios</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(availableServices).map(([key, service]) => (
                            <div key={key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                              <input
                                type="checkbox"
                                id={`service-${key}`}
                                checked={newProject.services.includes(key)}
                                onChange={(e) => {
                                  const isChecked = e.target.checked
                                  setNewProject(prev => ({
                                    ...prev,
                                    services: isChecked 
                                      ? [...prev.services, key]
                                      : prev.services.filter(s => s !== key)
                                  }))
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor={`service-${key}`} className="flex-1 cursor-pointer">
                                <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                <div className="text-xs text-gray-500">{service.description}</div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button 
                          onClick={handleCreateProject}
                          className="flex-1"
                          disabled={!newProject.name || !newProject.description}
                        >
                          Crear Proyecto
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Vista cards - siempre visible en mobile, condicionada por viewMode en desktop */}
            <div className={`md:${viewMode === "cards" ? "block" : "hidden"} block`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="group border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-500">{project.description}</p>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(project.status)}
                            {getPriorityBadge(project.priority)}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem>Editar proyecto</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progreso</span>
                          <span className="font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{project.team_size} miembros</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(project.end_date)}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Presupuesto</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(project.budget)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Vista tabla - solo visible en desktop */}
            <div className={`hidden md:${viewMode === "table" ? "block" : "hidden"}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Presupuesto</TableHead>
                    <TableHead>Fecha fin</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={project.progress} className="w-16 h-2" />
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(project.budget)}</TableCell>
                      <TableCell>{formatDate(project.end_date)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Pestaña de Servicios */}
          <TabsContent value="services" className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Servicios Disponibles</h2>
              <p className="text-sm text-gray-500">Configura los servicios activos para cada proyecto</p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {projects.map((project) => (
                <Card key={project.id} className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(project.services).map(([key, service]) => (
                        <div key={key} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-colors ${
                          service.active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${service.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium text-gray-700 block truncate">{service.name}</span>
                              <p className="text-xs text-gray-500 hidden sm:block">{availableServices[key as keyof typeof availableServices]?.description}</p>
                            </div>
                          </div>
                          <Switch 
                            checked={service.active}
                            onCheckedChange={(value) => handleServiceToggle(project.id, key, value)}
                            className="flex-shrink-0"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pestaña de Usuarios */}
          <TabsContent value="users" className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Usuarios</h2>
                <p className="text-sm text-gray-500">Gestiona los usuarios del cliente</p>
              </div>
              <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#4267b2] hover:bg-[#345995] text-white h-10 text-sm w-full sm:w-auto">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Nuevo Usuario</span>
                    <span className="sm:hidden">Nuevo</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user_name">Nombre completo</Label>
                      <Input
                        id="user_name"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="María García"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_email">Email</Label>
                      <Input
                        id="user_email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="maria@empresa.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user_role">Rol</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Visor</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleCreateUser}
                        className="flex-1"
                        disabled={!newUser.name || !newUser.email}
                      >
                        Crear Usuario
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último acceso</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.last_login ? formatDate(user.last_login) : "Nunca"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar usuario</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar contraseña</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Pestaña de Configuración UI */}
          <TabsContent value="ui-config" className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Configuración UI</h2>
              <p className="text-sm text-gray-500">Personaliza la apariencia de las plataformas del cliente</p>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {/* Información Básica */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Información Básica</h3>
                  <div>
                    <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">Nombre de la Empresa</Label>
                    <Input
                      id="company_name"
                      value={uiConfig.company_name}
                      onChange={(e) => handleUiConfigChange('company_name', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                      placeholder="Nombre para mostrar en plataformas"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="welcome_message" className="text-sm font-medium text-gray-700">Mensaje de Bienvenida</Label>
                    <Input
                      id="welcome_message"
                      value={uiConfig.welcome_message}
                      onChange={(e) => handleUiConfigChange('welcome_message', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                      placeholder="Mensaje de bienvenida personalizado"
                    />
                  </div>

                  <div>
                    <Label htmlFor="support_email" className="text-sm font-medium text-gray-700">Email de Soporte</Label>
                    <Input
                      id="support_email"
                      type="email"
                      value={uiConfig.support_email}
                      onChange={(e) => handleUiConfigChange('support_email', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                      placeholder="soporte@empresa.com"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Configuración Regional</h3>
                  <div>
                    <Label htmlFor="language" className="text-sm font-medium text-gray-700">Idioma</Label>
                    <Select value={uiConfig.language} onValueChange={(value) => handleUiConfigChange('language', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                        <SelectItem value="fr">Francés</SelectItem>
                        <SelectItem value="pt">Portugués</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Zona Horaria</Label>
                    <Select value={uiConfig.timezone} onValueChange={(value) => handleUiConfigChange('timezone', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                        <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="custom_domain" className="text-sm font-medium text-gray-700">Dominio Personalizado</Label>
                    <Input
                      id="custom_domain"
                      value={uiConfig.custom_domain}
                      onChange={(e) => handleUiConfigChange('custom_domain', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                      placeholder="plataforma.empresa.com"
                    />
                  </div>
                </div>
              </div>

              {/* Branding */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Logos y Recursos</h3>
                  <div>
                    <Label htmlFor="logo_url" className="text-sm font-medium text-gray-700">URL del Logo Principal</Label>
                    <Input
                      id="logo_url"
                      value={uiConfig.logo_url}
                      onChange={(e) => handleUiConfigChange('logo_url', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                      placeholder="https://ejemplo.com/logo.png"
                    />
                  </div>

                  <div>
                    <Label htmlFor="login_logo_url" className="text-sm font-medium text-gray-700">Logo para Login</Label>
                    <Input
                      id="login_logo_url"
                      value={uiConfig.login_logo_url}
                      onChange={(e) => handleUiConfigChange('login_logo_url', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                      placeholder="https://ejemplo.com/logo-login.png"
                    />
                  </div>

                  <div>
                    <Label htmlFor="favicon_url" className="text-sm font-medium text-gray-700">Favicon</Label>
                    <Input
                      id="favicon_url"
                      value={uiConfig.favicon_url}
                      onChange={(e) => handleUiConfigChange('favicon_url', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                      placeholder="https://ejemplo.com/favicon.ico"
                    />
                  </div>

                  <div>
                    <Label htmlFor="login_background" className="text-sm font-medium text-gray-700">Fondo de Login</Label>
                    <Input
                      id="login_background"
                      value={uiConfig.login_background}
                      onChange={(e) => handleUiConfigChange('login_background', e.target.value)}
                      className="mt-2 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                      placeholder="https://ejemplo.com/background.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Colores del Sistema</h3>
                  <div>
                    <Label htmlFor="primary_color" className="text-sm font-medium text-gray-700">Color Primario</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={uiConfig.primary_color}
                        onChange={(e) => handleUiConfigChange('primary_color', e.target.value)}
                        className="w-16 h-10 p-1 border-gray-200 rounded-lg"
                      />
                      <Input
                        value={uiConfig.primary_color}
                        onChange={(e) => handleUiConfigChange('primary_color', e.target.value)}
                        className="flex-1 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                        placeholder="#4267b2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondary_color" className="text-sm font-medium text-gray-700">Color Secundario</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={uiConfig.secondary_color}
                        onChange={(e) => handleUiConfigChange('secondary_color', e.target.value)}
                        className="w-16 h-10 p-1 border-gray-200 rounded-lg"
                      />
                      <Input
                        value={uiConfig.secondary_color}
                        onChange={(e) => handleUiConfigChange('secondary_color', e.target.value)}
                        className="flex-1 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                        placeholder="#64748b"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent_color" className="text-sm font-medium text-gray-700">Color de Acento</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="accent_color"
                        type="color"
                        value={uiConfig.accent_color}
                        onChange={(e) => handleUiConfigChange('accent_color', e.target.value)}
                        className="w-16 h-10 p-1 border-gray-200 rounded-lg"
                      />
                      <Input
                        value={uiConfig.accent_color}
                        onChange={(e) => handleUiConfigChange('accent_color', e.target.value)}
                        className="flex-1 border-gray-200 focus:border-[#4267b2] focus:ring-[#4267b2]"
                        placeholder="#4267b2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuración Avanzada */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Tema y Apariencia</h3>
                  <div>
                    <Label htmlFor="theme" className="text-sm font-medium text-gray-700">Tema</Label>
                    <Select value={uiConfig.theme} onValueChange={(value) => handleUiConfigChange('theme', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Modo Oscuro Disponible</Label>
                      <p className="text-xs text-gray-500">Permitir a usuarios cambiar tema</p>
                    </div>
                    <Switch 
                      checked={uiConfig.enable_dark_mode}
                      onCheckedChange={(value) => handleUiConfigChange('enable_dark_mode', value.toString())}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Notificaciones</Label>
                      <p className="text-xs text-gray-500">Habilitar sistema de notificaciones</p>
                    </div>
                    <Switch 
                      checked={uiConfig.enable_notifications}
                      onCheckedChange={(value) => handleUiConfigChange('enable_notifications', value.toString())}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Footer y Textos</h3>
                  <div>
                    <Label htmlFor="footer_text" className="text-sm font-medium text-gray-700">Texto del Footer</Label>
                    <textarea
                      id="footer_text"
                      value={uiConfig.footer_text}
                      onChange={(e) => handleUiConfigChange('footer_text', e.target.value)}
                      className="mt-2 w-full h-16 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#4267b2] focus:ring-[#4267b2] text-sm resize-none"
                      placeholder="© 2024 Tu Empresa. Todos los derechos reservados."
                    />
                  </div>

                  <div>
                    <Label htmlFor="custom_css" className="text-sm font-medium text-gray-700">CSS Personalizado</Label>
                    <textarea
                      id="custom_css"
                      value={uiConfig.custom_css}
                      onChange={(e) => handleUiConfigChange('custom_css', e.target.value)}
                      className="mt-2 w-full h-20 px-3 py-2 border border-gray-200 rounded-lg focus:border-[#4267b2] focus:ring-[#4267b2] text-sm font-mono"
                      placeholder="/* CSS personalizado */"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ClientDetailPage