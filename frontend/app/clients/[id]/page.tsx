"use client"

import { useState, useEffect } from "react"
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
  Settings,
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
import { apiService } from "@/lib/api"

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
  
  const [clientData, setClientData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [projectsServices, setProjectsServices] = useState<Record<number, any>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    services: [] as string[]
  })
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer"
  })

  useEffect(() => {
    loadClientData()
  }, [clientId])

  const loadClientData = async () => {
    try {
      setLoading(true)
      const client = await apiService.getClient(clientId)
      setClientData(client)
      setProjects(client.projects || [])
      
      // Load services for each project
      if (client.projects) {
        for (const project of client.projects) {
          try {
            const services = await apiService.getProjectServices(project.id)
            setProjectsServices(prev => ({
              ...prev,
              [project.id]: services.services
            }))
          } catch (error) {
            console.error(`Error loading services for project ${project.id}:`, error)
          }
        }
      }
    } catch (error) {
      console.error('Error loading client data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4267b2] mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando datos del cliente...</p>
        </div>
      </div>
    )
  }

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

  const handleServiceToggle = async (projectId: number, serviceKey: string, value: boolean) => {
    try {
      await apiService.toggleService(projectId, serviceKey)
      
      // Update local state
      setProjectsServices(prev => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          [serviceKey]: {
            ...prev[projectId][serviceKey],
            is_active: value
          }
        }
      }))
    } catch (error) {
      console.error('Error toggling service:', error)
    }
  }

  const handleCreateProject = async () => {
    try {
      const projectData = {
        client_id: clientId,
        name: newProject.name,
        description: newProject.description,
        start_date: newProject.start_date,
        end_date: newProject.end_date,
        status: "active"
      }
      
      const createdProject = await apiService.createProject(projectData)
      
      // Activate selected services for the new project
      if (newProject.services.length > 0) {
        for (const serviceType of newProject.services) {
          try {
            await apiService.toggleService(createdProject.id, serviceType)
          } catch (error) {
            console.error(`Error activating service ${serviceType}:`, error)
          }
        }
      }
      
      setNewProject({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        services: []
      })
      setIsCreateProjectOpen(false)
      
      // Reload client data
      loadClientData()
    } catch (error) {
      console.error('Error creating project:', error)
    }
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
        {labels[status as keyof typeof labels] || status}
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
        {labels[priority as keyof typeof labels] || priority}
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
        {labels[role as keyof typeof labels] || role}
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
      {/* Header */}
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
              <Button variant="outline" className="border-gray-300 h-10 text-sm">
                <Edit className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Editar Cliente</span>
                <span className="sm:hidden">Editar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Configuración</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Projects Tab */}
          <TabsContent value="projects" className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Proyectos</h2>
                <p className="text-sm text-gray-500">Gestiona los proyectos del cliente</p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">Servicios Iniciales</Label>
                        <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto">
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

            {/* Projects Cards */}
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
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{project.end_date ? formatDate(project.end_date) : 'Sin fecha'}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Servicios activos</span>
                        <span className="font-semibold text-gray-900">
                          {projectsServices[project.id] ? 
                            Object.values(projectsServices[project.id]).filter((s: any) => s.is_active).length : 0
                          } activos
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
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
                      {projectsServices[project.id] && Object.entries(projectsServices[project.id]).map(([key, service]: [string, any]) => (
                        <div key={key} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-colors ${
                          service.is_active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${service.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium text-gray-700 block truncate">{availableServices[key as keyof typeof availableServices]?.name || key}</span>
                              <p className="text-xs text-gray-500 hidden sm:block">{availableServices[key as keyof typeof availableServices]?.description}</p>
                            </div>
                          </div>
                          <Switch 
                            checked={service.is_active}
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

          {/* Users Tab */}
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
                    <span className="hidden sm:inline">Invitar Usuario</span>
                    <span className="sm:hidden">Invitar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Invitar Nuevo Usuario</DialogTitle>
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
                        Enviar Invitación
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Usuarios del proyecto</h3>
                <p className="text-gray-500 mb-4">Los usuarios invitados aparecerán aquí una vez que acepten la invitación.</p>
                <p className="text-sm text-gray-400">Actualmente: {users.length} usuario{users.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </TabsContent>

          {/* UI Configuration Tab */}
          <TabsContent value="ui-config" className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Configuración de UI</h2>
              <p className="text-sm text-gray-500">Personaliza la apariencia de las plataformas del cliente</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company_name">Nombre de la Empresa</Label>
                    <Input
                      id="company_name"
                      placeholder="Nombre para mostrar"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo_url">URL del Logo</Label>
                    <Input
                      id="logo_url"
                      placeholder="https://ejemplo.com/logo.png"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="primary_color">Color Primario</Label>
                    <div className="flex gap-3 mt-2">
                      <Input
                        id="primary_color"
                        type="color"
                        defaultValue="#4267b2"
                        className="w-16 h-10 p-1 rounded-lg"
                      />
                      <Input
                        defaultValue="#4267b2"
                        className="flex-1"
                        placeholder="#4267b2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Configuración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select defaultValue="es">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                        <SelectItem value="fr">Francés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select defaultValue="Europe/Madrid">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label className="text-sm font-medium">Modo Oscuro</Label>
                      <p className="text-xs text-gray-500">Permitir cambio de tema</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-[#4267b2] hover:bg-[#345995]">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ClientDetailPage