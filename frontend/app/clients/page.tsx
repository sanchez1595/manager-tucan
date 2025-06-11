"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Plus, 
  Search, 
  MoreHorizontal,
  Users as UsersIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Building2,
  Phone,
  Mail
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data con contenido original de clientes
const mockClients = [
  {
    id: 1,
    name: "Empresa ABC Corp",
    owner_contact: "María García",
    owner_email: "maria.garcia@abc-corp.com",
    owner_phone: "+1 555-0123",
    status: "Active",
    projects_count: 3,
    created_at: "2024-01-15"
  },
  {
    id: 2,
    name: "Tech Solutions Ltd", 
    owner_contact: "Carlos Rodríguez",
    owner_email: "carlos.rodriguez@techsolutions.com",
    owner_phone: "+1 555-0456",
    status: "Active",
    projects_count: 2,
    created_at: "2024-02-01"
  },
  {
    id: 3,
    name: "Digital Innovation SA",
    owner_contact: "Luis Fernández",
    owner_email: "luis.fernandez@digitalinnovation.com", 
    owner_phone: "+1 555-0789",
    status: "Inactive",
    projects_count: 1,
    created_at: "2024-02-15"
  },
  {
    id: 4,
    name: "Global Tech Inc",
    owner_contact: "Ana Torres",
    owner_email: "ana.torres@globaltech.com",
    owner_phone: "+1 555-0321", 
    status: "Active",
    projects_count: 5,
    created_at: "2024-03-01"
  },
  {
    id: 5,
    name: "Innovation Company",
    owner_contact: "Pedro Martínez",
    owner_email: "pedro.martinez@innovation.com",
    owner_phone: "+1 555-0654",
    status: "Suspended",
    projects_count: 0,
    created_at: "2024-02-20"
  },
  {
    id: 6,
    name: "Future Corporation",
    owner_contact: "Carmen López",
    owner_email: "carmen.lopez@future-corp.com",
    owner_phone: "+1 555-0987",
    status: "Active",
    projects_count: 2,
    created_at: "2024-03-10"
  }
]

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState(mockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    owner_contact: "",
    owner_email: "",
    owner_phone: ""
  })

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.owner_contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.owner_email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredClients.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedClients = filteredClients.slice(startIndex, startIndex + rowsPerPage)

  const handleClientClick = (clientId: number) => {
    router.push(`/clients/${clientId}`)
  }

  const handleCreateClient = () => {
    const client = {
      id: Date.now(),
      ...newClient,
      status: "Active",
      projects_count: 0,
      created_at: new Date().toISOString().split('T')[0]
    }
    setClients(prev => [...prev, client])
    setNewClient({
      name: "",
      owner_contact: "",
      owner_email: "",
      owner_phone: ""
    })
    setIsCreateClientOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Activo</Badge>
      case "Inactive":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Inactivo</Badge>
      case "Suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Suspendido</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Card única con todo el contenido */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Lista de Clientes</h1>
            <p className="text-sm text-gray-600">Gestiona tus clientes y sus proyectos aquí.</p>
          </div>
          
          <Dialog open={isCreateClientOpen} onOpenChange={setIsCreateClientOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4267b2] hover:bg-[#345995] text-sm h-10 px-4 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client_name">Nombre de la empresa</Label>
                  <Input
                    id="client_name"
                    value={newClient.name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Empresa ABC Corp"
                    className="mt-2 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="owner_contact">Nombre del contacto</Label>
                  <Input
                    id="owner_contact"
                    value={newClient.owner_contact}
                    onChange={(e) => setNewClient(prev => ({ ...prev, owner_contact: e.target.value }))}
                    placeholder="María García"
                    className="mt-2 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="owner_email">Email del contacto</Label>
                  <Input
                    id="owner_email"
                    type="email"
                    value={newClient.owner_email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, owner_email: e.target.value }))}
                    placeholder="maria.garcia@empresa.com"
                    className="mt-2 h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="owner_phone">Teléfono del contacto</Label>
                  <Input
                    id="owner_phone"
                    value={newClient.owner_phone}
                    onChange={(e) => setNewClient(prev => ({ ...prev, owner_phone: e.target.value }))}
                    placeholder="+1 555-0123"
                    className="mt-2 h-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    onClick={handleCreateClient}
                    className="flex-1 bg-[#4267b2] hover:bg-[#345995] h-10"
                    disabled={!newClient.name || !newClient.owner_contact || !newClient.owner_email}
                  >
                    Crear Cliente
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateClientOpen(false)} className="h-10">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filtrar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-gray-500 text-sm h-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-300 text-sm h-10 px-4 w-full sm:w-auto">
                  <span className="mr-2">⊕</span>
                  Estado
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>Activos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactivos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>Suspendidos</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Vista de tabla para desktop y cards para mobile */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-200">
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead className="text-gray-700 font-medium">Nombre</TableHead>
                <TableHead className="text-gray-700 font-medium">Contacto</TableHead>
                <TableHead className="text-gray-700 font-medium">Email</TableHead>
                <TableHead className="text-gray-700 font-medium">Teléfono</TableHead>
                <TableHead className="text-gray-700 font-medium">Estado</TableHead>
                <TableHead className="text-gray-700 font-medium">Proyectos</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.map((client) => (
                <TableRow 
                  key={client.id} 
                  className="hover:bg-gray-50 cursor-pointer border-gray-100"
                  onClick={() => handleClientClick(client.id)}
                >
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {client.name}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {client.owner_contact}
                  </TableCell>
                  <TableCell className="text-blue-600 hover:text-blue-800">
                    {client.owner_email}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {client.owner_phone}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(client.status)}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {client.projects_count} proyecto{client.projects_count !== 1 ? 's' : ''}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleClientClick(client.id)}>
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Suspender</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista de cards para mobile y tablet */}
        <div className="md:hidden space-y-3">
          {paginatedClients.map((client) => (
            <div 
              key={client.id}
              onClick={() => handleClientClick(client.id)}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 cursor-pointer transition-all touch-manipulation"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{client.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{client.owner_contact}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {getStatusBadge(client.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleClientClick(client.id)}>
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Suspender</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-blue-600 truncate">{client.owner_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{client.owner_phone}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-gray-500">
                    {client.projects_count} proyecto{client.projects_count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-gray-500">
                    Creado: {new Date(client.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-700 hidden md:block">
            {selectedRows.length} de {filteredClients.length} fila(s) seleccionadas.
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700 hidden sm:inline">Filas por página</span>
              <span className="text-gray-700 sm:hidden">Por página:</span>
              <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(parseInt(value))}>
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10 w-10 p-0 touch-manipulation"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                aria-label="Primera página"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10 w-10 p-0 touch-manipulation"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10 w-10 p-0 touch-manipulation"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10 w-10 p-0 touch-manipulation"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                aria-label="Última página"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}